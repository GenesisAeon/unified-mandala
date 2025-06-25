import unittest

from aeon_processor import translate_numeric_to_symbolic, advanced_crep_eval, fraktal_feedback_metrics

class TestAdvancedCREP(unittest.TestCase):
    def test_metrics_keys(self):
        symbolic = translate_numeric_to_symbolic([0.1, 0.2, 0.3])
        metrics = advanced_crep_eval(symbolic)
        for key in ["kohärenz", "resonanz", "emergenz", "präsenz"]:
            self.assertIn(key, metrics)

    def test_feedback_metrics(self):
        symbolic, score, metrics = fraktal_feedback_metrics([0.1, 0.4, 0.7], depth=2)
        self.assertIsInstance(symbolic, dict)
        self.assertIsInstance(score, int)
        self.assertIsInstance(metrics, dict)
        self.assertIn("präsenz", metrics)

if __name__ == "__main__":
    unittest.main()
