"""Remove session material from Playwright artifacts before sharing/uploading.

stdlib only; zip entries are kept (including trace resources) for Trace Viewer.
UUID sessions, cookie headers and cookie objects are scrubbed recursively.
"""
import io
import json
import re
import sys
import zipfile
from pathlib import Path

UUID = re.compile(r'[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}')

def clean(value):
    if isinstance(value, dict):
        if str(value.get('name', '')).lower() in ('cookie', 'set-cookie', 'authorization'):
            return {k: '[REDACTED]' if k == 'value' else clean(v) for k, v in value.items()}
        if str(value.get('name', '')).startswith(('lp_client', 'lp_admin')):
            return {k: '[REDACTED]' if k == 'value' else clean(v) for k, v in value.items()}
        return {k: '[REDACTED]' if k.lower() in ('cookie', 'set-cookie', 'authorization', 'token') else clean(v) for k, v in value.items()}
    if isinstance(value, list):
        return [clean(v) for v in value]
    if isinstance(value, str):
        return UUID.sub('[REDACTED-UUID]', value)
    return value

def scrub(data, name):
    if data.startswith(b'PK\x03\x04'):
        result = io.BytesIO()
        with zipfile.ZipFile(io.BytesIO(data)) as source, zipfile.ZipFile(result, 'w', zipfile.ZIP_DEFLATED) as target:
            for entry in source.infolist():
                target.writestr(entry.filename, scrub(source.read(entry), entry.filename))
        return result.getvalue()
    if name.endswith(('.png', '.jpg', '.jpeg', '.webm', '.woff', '.ttf')):
        return data
    try:
        text = data.decode('utf-8')
    except UnicodeDecodeError:
        return data
    try:
        return json.dumps(clean(json.loads(text)), ensure_ascii=False).encode('utf-8')
    except (ValueError, TypeError):
        lines = []
        for line in text.splitlines(keepends=True):
            try:
                lines.append(json.dumps(clean(json.loads(line)), ensure_ascii=False) + '\n')
            except (ValueError, TypeError):
                lines.append(UUID.sub('[REDACTED-UUID]', line))
        return ''.join(lines).encode('utf-8')

if __name__ == '__main__':
    count = 0
    for root in sys.argv[1:] or ['test-results', 'playwright-report', 'audit-results']:
        for path in Path(root).rglob('*'):
            if path.is_file():
                original = path.read_bytes()
                updated = scrub(original, path.name)
                if original != updated:
                    path.write_bytes(updated)
                    count += 1
    print(f'Preuves expurgées : {count} fichiers ; aucun cookie affiché.')
