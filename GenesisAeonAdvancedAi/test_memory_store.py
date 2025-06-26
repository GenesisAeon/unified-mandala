import unittest
import json
import pathlib

from GenesisAeonAdvancedAi.memory_store import (
    store_result,
    load_results,
    summarize_memory,
    summarize_entries,
    tail_results,
    trend_metric,
)


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

    def test_summarize_memory(self):
        path = pathlib.Path('temp_mem.json')
        if path.exists():
            path.unlink()
        store_result({'crep_score': 1}, path)
        store_result({'crep_score': 0}, path)
        summary = summarize_memory(path)
        self.assertAlmostEqual(summary.get('crep_score'), 0.5)
        path.unlink()

    def test_summarize_entries(self):
        entries = [
            {"a": 1, "b": 2.0},
            {"a": 3, "b": 4.0},
        ]
        result = summarize_entries(entries)
        self.assertEqual(result["a"], 2.0)
        self.assertEqual(result["b"], 3.0)

    def test_tail_results(self):
        path = pathlib.Path("temp_mem.json")
        if path.exists():
            path.unlink()
        for i in range(5):
            store_result({"idx": i}, path)
        tail = tail_results(path, 2)
        self.assertEqual(len(tail), 2)
        self.assertEqual(tail[0]["idx"], 3)
        self.assertEqual(tail[1]["idx"], 4)
        path.unlink()

    def test_trend_metric(self):
        path = pathlib.Path("temp_mem.json")
        if path.exists():
            path.unlink()
        store_result({"score": -1}, path)
        store_result({"score": 1}, path)
        trend = trend_metric(path, "score", 2)
        self.assertAlmostEqual(trend, 2.0)
        path.unlink()


if __name__ == '__main__':
    unittest.main()

