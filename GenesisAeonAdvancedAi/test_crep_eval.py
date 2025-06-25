import unittest

from GenesisAeonAdvancedAi.crep_eval import evaluate_crep


class TestCrepEval(unittest.TestCase):
    def test_keys_present(self):
        metrics = evaluate_crep("data")
        for key in ["coherence", "resonance", "emergence", "presence"]:
            self.assertIn(key, metrics)


if __name__ == "__main__":
    unittest.main()
