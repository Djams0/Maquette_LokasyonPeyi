"""Verify the V3.2 kit's paths, hashes, credits, references and code pointers."""
import json
import re
from hashlib import sha256
from pathlib import Path
from urllib.parse import unquote, urlsplit

root = Path(__file__).resolve().parents[1]
repo = root.parent
manifest_path = root / 'HANDOFF_MANIFEST.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
errors = []


def check(condition, message):
    if not condition:
        errors.append(message)


def kit_file(item):
    relative = Path(item['path'])
    check(not relative.is_absolute() and '..' not in relative.parts, f'Chemin invalide: {relative}')
    p = root / relative
    if not p.is_file():
        errors.append(f'Fichier manquant: {relative}')
        return
    raw = p.read_bytes()
    check(len(raw) == item['bytes'], f'Taille incorrecte: {relative}')
    check(sha256(raw).hexdigest() == item['sha256'], f'Empreinte incorrecte: {relative}')


expected = {item['path'] for item in manifest['files']}
actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() and p != manifest_path}
check(actual == expected, f'Inventaire divergent. Absents: {sorted(expected-actual)}. En trop: {sorted(actual-expected)}.')
for item in manifest['files']:
    kit_file(item)

photos = json.loads((root / '04_VISUAL_REFERENCES/asset-manifest.json').read_text(encoding='utf-8'))['photos']
check(len(photos) == len({photo['id'] for photo in photos}) == 16, 'Seize photos uniques attendues.')
photo_paths = set()
for photo in photos:
    check(all(photo.get(k) for k in ('author','source','license','license_url','credit','transform','alt')), f'Crédit incomplet: {photo["id"]}')
    variants = photo['variants'] + ([photo['original_local']] if 'original_local' in photo else [])
    for variant in variants:
        kit_file({'path':variant['kit'], **variant})
        photo_paths.add(variant['kit'])
check(len(photo_paths) == 32 and sum(p.endswith('.webp') for p in photo_paths) == 31, 'Vérifier les variantes (31 WebP et le JPEG source).')

prompts = sorted(root.glob('06_CODEX_PROMPTS/LOT_*.md'))
check(len(prompts) == 10, 'Dix prompts attendus.')
in_repo = (repo / 'package.json').is_file() and (repo / 'client').is_dir()
for n, prompt in enumerate(prompts):
    contents = prompt.read_text(encoding='utf-8')
    headings = [int(x) for x in re.findall(r'^## (\d+)\.', contents, re.M)]
    check(headings == list(range(1,19)) and prompt.name.startswith(f'LOT_{n:02d}_'), f'Structure du prompt: {prompt.name}')
    for relative in re.findall(r'^- LOKASYON_PEYI_DESIGN_HANDOFF/(.+)$', contents, re.M):
        check((root / relative).is_file(), f'Ressource de prompt absente: {relative}')
    if in_repo:
        paths = contents.partition('## 6.')[2].partition('## 7.')[0].splitlines()
        for line in paths:
            if line.startswith('- '):
                check((repo / line[2:]).is_file(), f'Chemin de code absent: {line[2:]}')

link_total = 0
for p in root.rglob('*.md'):
    if '04_VISUAL_REFERENCES/ressources' in p.as_posix():
        continue
    for href in re.findall(r'\]\(([^)]+)\)', p.read_text(encoding='utf-8')):
        link = urlsplit(href)
        if link.scheme or not link.path:
            continue
        target = (p.parent / unquote(link.path)).resolve()
        if in_repo or target.is_relative_to(root):
            link_total += 1
            check(target.exists(), f'Lien absent: {p.relative_to(root)} -> {href}')

if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK · {len(expected)} fichiers, {link_total} liens, {len(photos)} photos, {len(photo_paths)} fichiers photo, {len(prompts)} prompts.')
