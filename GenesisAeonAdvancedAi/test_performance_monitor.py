import unittest

from GenesisAeonAdvancedAi.performance_monitor import monitor_performance

class TestPerformanceMonitor(unittest.TestCase):
    def test_monitor_returns_metrics(self):
        metrics = monitor_performance([0.1, 0.5, 0.9], depth=2)
        self.assertIn("result", metrics)
        self.assertIn("duration", metrics)
        self.assertIn("peak_memory", metrics)
        symbolic, score = metrics["result"]
        self.assertIsInstance(symbolic, dict)
        self.assertIsInstance(score, int)

if __name__ == "__main__":
    unittest.main()
