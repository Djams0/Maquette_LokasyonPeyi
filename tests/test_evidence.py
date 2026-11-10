import io
import json
import runpy
import unittest
import zipfile
from pathlib import Path

scrub = runpy.run_path(str(Path(__file__).parents[1] / 'scripts' / 'sanitize-evidence.py'))['scrub']

class EvidenceTests(unittest.TestCase):
    def test_nested_trace_archive_removes_cookies_and_session_uuid(self):
        sensitive = '00000000-0000-4000-8000-000000000000'
        network = {'headers': [{'name': 'Cookie', 'value': 'lp_client=' + sensitive}],
                   'cookies': [{'name': 'lp_admin', 'value': 'secret-test-value'}]}
        inner = io.BytesIO()
        with zipfile.ZipFile(inner, 'w') as z:
            z.writestr('0-trace.network', json.dumps(network) + '\n')
            z.writestr('resources/image.png', b'\x89PNG\x00example')
        outer = io.BytesIO()
        with zipfile.ZipFile(outer, 'w') as z:
            z.writestr('trace.zip', inner.getvalue())
        with zipfile.ZipFile(io.BytesIO(scrub(outer.getvalue(), 'report.zip'))) as z:
            with zipfile.ZipFile(io.BytesIO(z.read('trace.zip'))) as trace:
                cleaned = trace.read('0-trace.network')
                self.assertNotIn(sensitive.encode(), cleaned)
                self.assertNotIn(b'secret-test-value', cleaned)
                self.assertEqual(trace.read('resources/image.png'), b'\x89PNG\x00example')

    def test_authorization_keys_and_arbitrary_cookie_values_are_redacted(self):
        result = json.loads(scrub(b'{"authorization":"secret","headers":[{"name":"Set-Cookie","value":"opaque"}]}', 'result.json'))
        self.assertEqual(result['authorization'], '[REDACTED]')
        self.assertEqual(result['headers'][0]['value'], '[REDACTED]')

if __name__ == '__main__':
    unittest.main()
