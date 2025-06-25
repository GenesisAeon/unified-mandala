import unittest
import json
import pathlib

from GenesisAeonAdvancedAi.memory_store import store_result, load_results


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

    def test_load_results(self):
        path = pathlib.Path('temp_mem.json')
        if path.exists():
            path.unlink()
        store_result({'x': 1}, path)
        store_result({'y': 2}, path)
        results = load_results(path)
        self.assertEqual(len(results), 2)
        self.assertIsInstance(results[0], dict)
        path.unlink()


if __name__ == '__main__':
    unittest.main()
