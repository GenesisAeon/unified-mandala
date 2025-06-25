import unittest
import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

from memory_store import store_result


class TestMemoryStore(unittest.TestCase):
    def test_store_appends(self):
        path = pathlib.Path('temp_mem.json')
        if path.exists():
            path.unlink()
        store_result({'a': 1}, path)
        self.assertTrue(path.exists())
        data = json.loads(path.read_text())
        self.assertEqual(len(data), 1)
        store_result({'b': 2}, path)
        data = json.loads(path.read_text())
        self.assertEqual(len(data), 2)
        path.unlink()


if __name__ == '__main__':
    unittest.main()
