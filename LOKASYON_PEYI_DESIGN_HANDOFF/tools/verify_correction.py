"""Validate the active V3.2 prompts, route coverage and visual review rows."""
import csv
import json
from pathlib import Path
import re
from urllib.parse import urlsplit

root = Path(__file__).resolve().parents[1]
repo = root.parent
in_repo = (repo / 'client/app.js').is_file()
errors = []


def read(name):
    return (root / name).read_text(encoding='utf-8')


def check(condition, message):
    if not condition:
        errors.append(message)


def csv_rows(path):
    with path.open(encoding='utf-8-sig', newline='') as handle:
        return list(csv.DictReader(handle, delimiter=';'))


def base_route(route):
    return urlsplit(route).path


campaign = json.loads(read('09_IMPLEMENTATION/LOT_INDEX.json'))['correction_v32']
lots = campaign['lots']
lot_ids = [lot['id'] for lot in lots]
matrix_path = root / campaign['matrix']
matrix = csv_rows(matrix_path)
by_id = {}
sizes = {'390×844', '1440×960'}
for row in matrix:
    by_id.setdefault(row['ID'], []).append(row)

check(lot_ids == [f'R{i:02d}' for i in range(1, len(lots) + 1)], 'Ordre ou identifiants de lots invalides')
expected_files = {lot['prompt'] for lot in lots}
prompt_dir = (root / campaign['entry']).parent
actual_files = {path.relative_to(root).as_posix() for path in prompt_dir.glob('R[0-9][0-9]_*.md')}
check(expected_files == actual_files, 'Inventaire des prompts actifs divergent')
check(campaign['entry'] == lots[0]['prompt'], 'Point de départ incohérent')
start = read('CODEX_START_HERE.md')
check(f']({campaign["entry"]})' in start, 'CODEX_START_HERE ne pointe pas sur le premier prompt')
index = read('07_CODEX_PROMPTS/correction-v32/README.md')
tracker = read('09_IMPLEMENTATION/PROGRESS_TRACKER.md')
audit = read('01_AUDIT/ECARTS_CORRECTION_V32.md')
anchors = {heading.lower() for heading in re.findall(r'^### ([A-Z]+-\d+)$', audit, re.MULTILINE)}
indexed_checks = [check_id for lot in lots for check_id in lot['checks']]
check(len(indexed_checks) == len(set(indexed_checks)) and set(indexed_checks) == set(by_id),
      'Identifiants de preuve incohérents dans les lots et la matrice')
check(anchors == {key.lower() for key in by_id}, 'Identifiants de preuve incohérents dans l’audit')

for i, lot in enumerate(lots):
    lot_id = lot['id']
    name = lot['prompt']
    body = read(name)
    check(lot['deps'] == (lot_ids[i - 1:i] if i else []), f'Dépendance du lot {lot_id}')
    check(f']({Path(name).name})' in index and f'](../{name})' in tracker, f'Index ou suivi incomplet : {lot_id}')
    for token in (campaign['audit_sha'], lot['branch'], '## Point de départ Git', '## Sources à ouvrir',
                  '## Fichiers et scénarios', '## Rendu et gestes à préserver', '## Validation observable',
                  '## Exécuter les vérifications', '## Preuves, PR et passage', 'la planche validée'):
        check(token in body, f'Consigne manquante : {lot_id} → {token}')
    if in_repo:
        for path in lot['files'] + lot['tests']:
            check((repo / path).is_file(), f'Fichier de lot absent : {lot_id} → {path}')

    for key in lot['checks']:
        check(key in body and key in index, f'Critère absent du prompt ou de l’index : {lot_id} → {key}')
        for row in by_id.get(key, []):
            check(row['Lot'] == lot_id, f'Lot différent entre index et matrice : {key}')
            for page in map(int, row['Pages B'].split(',')):
                if page >= 11:
                    board = f'04_VISUAL_REFERENCES/extension/planches/B-{page:02d}.jpg'
                    check(board in body and (root / board).is_file(), f'Planche absente : {lot_id} → B-{page:02d}')
                else:
                    check(f'Extension_Espaces_Client.pdf#page={page}' in body,
                          f'Page PDF absente : {lot_id} → {page}')

required = ['Zone', 'Scénario', 'Rendu attendu', 'Critère observable', 'Fidélité', 'Fonctionnement',
            'Protection de l’existant']
for key, items in by_id.items():
    check(len(items) == len(sizes) and {r['Viewport'] for r in items} == sizes,
          f'Largeurs manquantes ou dupliquées : {key}')
    for row in items:
        check(all(row[field].strip() for field in required), f'Critère incomplet : {key}')
        link = urlsplit(row['Preuve de départ'])
        expected_audit = root / '01_AUDIT/ECARTS_CORRECTION_V32.md'
        check((matrix_path.parent / link.path).resolve() == expected_audit and link.fragment == key.lower(),
              f'Lien d’audit invalide : {key}')

screens = json.loads(read('05_SCREEN_SPECS/SCREEN_INDEX.json'))
check(screens['correction_audit_sha'] == campaign['audit_sha'], 'SHA d’audit différent dans l’index des écrans')
routes = csv_rows(root / '01_AUDIT/MATRICE_ROUTES_COMPOSANTS_API.csv')
route_rows = {r['Route']: r for r in routes}
for item in screens['routes']:
    route = item['route']
    matches = {key: rows[0] for key, rows in by_id.items() if base_route(rows[0]['Route']) == route}
    registered = item.get('correction_v32', [])
    check(bool(matches) and set(matches) == {entry['id'] for entry in registered},
          f'Critères absents ou divergents pour la route : {route}')
    check(set(matches) == set(route_rows[route]['Critères de correction V3.2'].split(', ')),
          f'Cartographie CSV divergente : {route}')
    group_doc = read(f'05_SCREEN_SPECS/{item["group"]}.md')
    for entry in registered:
        key = entry['id']
        candidate = matches.get(key)
        check(candidate is not None and entry['lot'] == candidate['Lot'] and entry['zone'] == candidate['Zone']
              and entry['pages'] == list(map(int, candidate['Pages B'].split(','))),
              f'Index écran divergent : {key}')
        check(f'### {key} ·' in group_doc and f'ECARTS_CORRECTION_V32.md#{key.lower()}' in group_doc,
              f'Fiche écran incomplète : {key}')

if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK correction V3.2 · {len(lots)} prompts · {len(screens["routes"])} routes '
      f'· {len(by_id)} critères · {len(matrix)} lignes de recette.')
