import unittest
from GenesisAeonAdvancedAi.adaptive_threshold import auto_adapt_crep_threshold


class TestAutoAdaptCREPThreshold(unittest.TestCase):
    def test_low_average_returns_low_threshold(self):
        memory = [{"crep": 0.3} for _ in range(5)]
        self.assertEqual(auto_adapt_crep_threshold(memory), 0.2)

    def test_high_average_returns_high_threshold(self):
        memory = [{"crep_score": 0.9} for _ in range(5)]
        self.assertEqual(auto_adapt_crep_threshold(memory), 0.8)

    def test_mid_average_returns_default(self):
        memory = [{"crep": 0.5}, {"crep_score": 0.55}]
        self.assertEqual(auto_adapt_crep_threshold(memory), 0.5)


if __name__ == "__main__":
    unittest.main()
