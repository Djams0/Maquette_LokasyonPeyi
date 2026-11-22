"""Validate the V3.2 client extension and its relationship with the audited repository."""
import csv
from hashlib import sha256
import json
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
repository = root.parent
in_repository = (repository / 'package.json').is_file() and (repository / 'client/app.js').is_file()
errors = []


def ensure(condition, issue):
    if not condition:
        errors.append(issue)


def document(path):
    return json.loads((root / path).read_text(encoding='utf-8'))


def verify_bytes(path, digest):
    ensure(path.is_file() and sha256(path.read_bytes()).hexdigest() == digest, f'Fichier ou empreinte: {path}')


base = '4338f5f7ca252f4d4f02021ec47a226d0d2d6064'
pdfs = {
    'Lokasyon_Peyi_Direction_UXUI_V3.2_Finale.pdf': '55b0c18274d20348b64266e469c5a6355b5f95ef6a4cc2952cba0903bd2821b8',
    'Lokasyon_Peyi_Direction_UXUI_V3.2_Extension_Espaces_Client.pdf': 'd3542655afffa94470778753fd693d5b2fd92973fecab11e3b9eadca3f01d844',
}
for filename, digest in pdfs.items():
    verify_bytes(root / '00_SOURCE_OF_TRUTH' / filename, digest)

by_route = document('05_SCREEN_SPECS/SCREEN_INDEX.json')['routes']
with (root / '01_AUDIT/MATRICE_ROUTES_COMPOSANTS_API.csv').open(encoding='utf-8-sig', newline='') as file:
    routes_csv = list(csv.DictReader(file, delimiter=';'))
ensure(len(by_route) == len(routes_csv) == 33 and {x['route'] for x in by_route} == {x['Route'] for x in routes_csv}, 'Matrice des routes divergente')
for route in by_route:
    ensure((root / '05_SCREEN_SPECS' / (route['group'] + '.md')).is_file(), f'Spec absente: {route["route"]}')
    if in_repository:
        for path in route['files']:
            ensure((repository / path).is_file(), f'Chemin code absent: {path}')

lots = document('09_IMPLEMENTATION/LOT_INDEX.json')
ensure(lots['base'] == base and len(lots['lots']) == 12, 'Base ou nombre de lots')
ensure(len(list((root / '07_CODEX_PROMPTS').glob('LOT_*.md'))) == 12, 'Nombre de fichiers prompts')
for n, lot in enumerate(lots['lots']):
    doc = root / lot['prompt']
    ensure(lot['index'] == n and all(0 <= i < n for i in lot['deps']), f'Dépendance invalide: {n}')
    body = doc.read_text(encoding='utf-8')
    ensure([int(x) for x in re.findall(r'^## (\d+)\.', body, re.M)] == list(range(1,24)), f'Structure: {doc.name}')
    ensure(base in body and f'client-v32/lot-{n:02d}' in body, f'Instructions Git absentes: {doc.name}')
    for rel in re.findall(r'^- LOKASYON_PEYI_DESIGN_HANDOFF/(.+)$', body, re.M):
        ensure((root / rel).is_file(), f'Fichier référencé absent: {doc.name} → {rel}')
    if in_repository:
        for path in lot['files'] + lot['tests']:
            ensure((repository / path).is_file(), f'Chemin de lot absent: {path}')

cap = document('04_VISUAL_REFERENCES/protected_baseline/CAPTURE_MANIFEST.json')
protected = [entry for entry in cap['result'] if entry['type'] == 'protected']
widths = {320,375,390,430,768,1024,1280,1440}
wanted = {(route,width) for route in ('/','/search','/vehicle/v3') for width in widths}
ensure(len(protected) == 24 and len(cap['result']) == 70 and wanted == {(x['route'],x['viewport']['width']) for x in protected}, 'Captures et largeurs attendues')
for capture in cap['result']:
    verify_bytes(root / capture['kit_path'], capture['sha256'])
    ensure(not capture['errors'] and capture['scrollWidth'] <= capture['viewport']['width'] + 1, f'Métriques baseline: {capture["kit_path"]}')

for page in range(11,50):
    ensure((root / '04_VISUAL_REFERENCES/extension/planches' / f'B-{page:02d}.jpg').is_file(), f'Planche {page} absente')

assets = document('03_ASSETS/asset-manifest.json')['runtime_resources']
ensure(len(assets) == len({a['id'] for a in assets}) == 37, 'Inventaire des ressources runtime')
for asset in assets:
    ensure(all(asset.get(field) for field in ('id','path','source','author','license','attribution','use')), f'Provenance: {asset["id"]}')
    if in_repository:
        verify_bytes(repository / asset['path'], asset['sha256'])
    if asset.get('kit_source'):
        verify_bytes(root / asset['kit_source'], asset['sha256'])
if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK extension · {len(by_route)} routes · {len(lots["lots"])} prompts · {len(protected)} PNG protégés · {len(assets)} ressources runtime · 2 PDF.')
