#!/usr/bin/env python3
"""Verify the portable handoff with Python 3.9+ and no third-party modules."""
from hashlib import sha256
import json
from pathlib import Path
import re
import struct
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
CATALOG = 'FILE_MANIFEST.json'
ERRORS = []


def read_json(relative):
    return json.loads((ROOT / relative).read_text(encoding='utf-8'))


def expect(condition, description):
    if not condition:
        ERRORS.append(description)


def checked_path(relative):
    path = (ROOT / relative).resolve()
    if not path.is_relative_to(ROOT):
        raise ValueError(f'Path outside the kit: {relative}')
    return path


def verify_inventory():
    files = read_json(CATALOG)['files']
    expected = {item['path'] for item in files}
    actual = {
        path.relative_to(ROOT).as_posix()
        for path in ROOT.rglob('*')
        if path.is_file() and path.name != CATALOG
    }
    expect(len(expected) == len(files), 'Duplicate file in inventory')
    expect(expected == actual, f'Inventory mismatch: {sorted(expected ^ actual)}')
    for item in files:
        path = checked_path(item['path'])
        if path.is_file():
            data = path.read_bytes()
            expect(len(data) == item['bytes'], f'Unexpected size: {item["path"]}')
            expect(sha256(data).hexdigest() == item['sha256'], f'Invalid digest: {item["path"]}')
    return len(files)


def verify_links():
    count = 0
    for document in ROOT.rglob('*.md'):
        text = document.read_text(encoding='utf-8')
        for link in re.findall(r'\]\(([^()\s]+)\)', text):
            url = urlsplit(link)
            if url.scheme or url.netloc or not url.path:
                continue
            count += 1
            path = (document.parent / unquote(url.path)).resolve()
            expect(path.is_relative_to(ROOT) and path.exists(), f'{document.relative_to(ROOT)} → {link}')
    return count


def verify_prompts():
    prompts = sorted((ROOT / '05_CODEX_PROMPTS').glob('LOT_*.md'))
    expect(len(prompts) == 10, 'Expected ten lot prompts')
    for path in prompts:
        text = path.read_text(encoding='utf-8')
        sections = re.findall(r'^## ([A-L])\.', text, re.M)
        expect(sections == list('ABCDEFGHIJKL'), f'{path.name}: missing or unordered A–L sections')
        section_c = text.partition('## C.')[2].partition('## D.')[0]
        expect('.png]' in section_c and '04_SCREEN_SPECS/' in section_c, f'{path.name}: missing visual refs')
    return len(prompts)


def verify_tokens():
    tokens = read_json('02_DESIGN_SYSTEM/design-tokens.json')
    css = (ROOT / '02_DESIGN_SYSTEM/tokens.css').read_text(encoding='utf-8')
    found = dict(re.findall(r'^\s*--([\w-]+):\s*([^;]+);$', css, re.M))
    expected = {
        f'{tokens["prefix"]}-{group}-{key}': value
        for group, values in tokens['groups'].items()
        for key, value in values.items()
    }
    expect(found == expected, 'CSS and JSON tokens differ')
    anchors = {'ink':'#152C27','action':'#145D4C','ivory':'#F6F4ED','ochre':'#EEC473','info-bg':'#E1F1EB'}
    for key, value in anchors.items():
        expect(tokens['groups']['color'][key] == value, f'Brand color changed: {key}')
    return len(found)


def webp_size(data):
    expect(data[:4] == b'RIFF' and data[8:12] == b'WEBP', 'Invalid WebP container')
    kind = data[12:16]
    if kind == b'VP8X':
        return [int.from_bytes(data[i:i+3], 'little') + 1 for i in (24, 27)]
    if kind == b'VP8 ' and data[23:26] == b'\x9d\x01\x2a':
        return [x & 0x3fff for x in struct.unpack_from('<HH', data, 26)]
    if kind == b'VP8L' and data[20] == 0x2f:
        bits = int.from_bytes(data[21:25], 'little')
        return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1]
    raise ValueError('Unknown WebP header')


def verify_svg(path, size):
    root = ElementTree.parse(path).getroot()
    ns = '{http://www.w3.org/2000/svg}'
    expect(root.tag == ns + 'svg' and 'viewBox' in root.attrib, f'{path.name}: invalid SVG')
    expect([int(root.get(key, 0)) for key in ('width','height')] == size, f'{path.name}: SVG size')
    for node in root.iter():
        name = node.tag.rsplit('}', 1)[-1]
        expect(name in {'svg','symbol','path','rect','circle','g','title','desc'}, f'{path.name}: SVG element {name}')
        for key, value in node.attrib.items():
            local = key.rsplit('}', 1)[-1].lower()
            safe = not local.startswith('on') and local not in {'href','style'} and 'url(' not in value.lower()
            expect(safe, f'{path.name}: unsafe SVG attribute {key}')


def verify_assets():
    assets = read_json('03_ASSETS/asset-manifest.json')['assets']
    index = {item['chemin']: item for item in assets}
    expect(len(index) == len(assets), 'Duplicate path in asset manifest')
    expected_extensions = {'.png','.webp','.svg','.ttf','.pdf','.html'}
    expected_files = {
        p.relative_to(ROOT).as_posix()
        for p in ROOT.rglob('*')
        if p.is_file() and p.suffix.lower() in expected_extensions
    }
    expect(set(index) == expected_files, 'Incomplete asset manifest')
    for relative, item in index.items():
        path = checked_path(relative)
        data = path.read_bytes()
        expect(path.name == item['fichier'], f'Wrong asset name: {relative}')
        expect(len(data) == item['octets'], f'Wrong asset size: {relative}')
        expect(sha256(data).hexdigest() == item['sha256'], f'Wrong asset digest: {relative}')
        expect(all(item.get(k) for k in ('fonction','ecrans','origine','auteur','licence_ou_usage','statut','attribution')), f'Missing metadata: {relative}')
        if path.suffix == '.png':
            expect(data.startswith(b'\x89PNG\r\n\x1a\n') and data[12:16] == b'IHDR', f'Invalid PNG: {relative}')
            expect(list(struct.unpack_from('>II', data, 16)) == item['dimensions'], f'PNG dimensions: {relative}')
        if path.suffix == '.webp':
            expect(webp_size(data) == item['dimensions'], f'WebP dimensions: {relative}')
            expect(isinstance(item['alt'], str) and bool(item['alt']), f'Missing photo alt: {relative}')
        if path.suffix == '.svg':
            verify_svg(path, item['dimensions'])
        if path.suffix == '.pdf':
            expect(data.startswith(b'%PDF-'), f'Invalid PDF: {relative}')
    for screen in read_json('04_SCREEN_SPECS/screen-index.json'):
        expect(checked_path(screen['file']).is_file(), f'Missing screen spec: {screen["file"]}')
        for relative in screen['target']:
            expect(index[relative]['dimensions'] == screen['exportPixels'], f'Target dimensions: {relative}')
        for relative in screen['current']:
            expect(relative in index, f'Missing baseline asset: {relative}')
    return len(assets)


if __name__ == '__main__':
    counts = (verify_inventory(), verify_links(), verify_prompts(), verify_tokens(), verify_assets())
    if ERRORS:
        raise SystemExit('\n'.join(ERRORS))
    print('OK · {} fichiers · {} liens locaux · {} prompts A–L · {} tokens · {} assets'.format(*counts))
