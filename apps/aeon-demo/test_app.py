import runpy
import types
import sys
import os
import unittest

class TestDemoApp(unittest.TestCase):
    def test_app_runs(self):
        mod = types.ModuleType('streamlit')
        mod.title = lambda *a, **k: None
        mod.text_input = lambda *a, **k: "0.1"
        mod.button = lambda *a, **k: False
        mod.json = lambda *a, **k: None
        mod.error = lambda *a, **k: None
        sys.modules['streamlit'] = mod
        sys.path.insert(0, os.path.abspath('.'))
        runpy.run_path('apps/aeon-demo/app.py', run_name='__main__')

if __name__ == '__main__':
    unittest.main()
