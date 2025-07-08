import unittest

from GenesisAeonAdvancedAi.aeon_processor import (
    translate_numeric_to_symbolic,
    advanced_crep_eval,
    fraktal_feedback_metrics,
)

class TestAdvancedCREP(unittest.TestCase):
    def test_metrics_keys(self):
        symbolic = translate_numeric_to_symbolic([0.1, 0.2, 0.3])
        metrics = advanced_crep_eval(symbolic)
        for key in ["kohärenz", "resonanz", "emergenz", "emergenz_cluster", "präsenz"]:
            self.assertIn(key, metrics)

    def test_feedback_metrics(self):
        symbolic, score, metrics = fraktal_feedback_metrics([0.1, 0.4, 0.7], depth=2)
        self.assertIsInstance(symbolic, dict)
        self.assertIsInstance(score, int)
        self.assertIsInstance(metrics, dict)
        self.assertIn("präsenz", metrics)

    def test_resonance_correlation(self):
        prev = translate_numeric_to_symbolic([0.1, 0.2, 0.3])
        curr = translate_numeric_to_symbolic([0.1, 0.2, 0.3])
        metrics = advanced_crep_eval(curr, [prev])
        self.assertAlmostEqual(metrics["resonanz"], 1.0, places=5)

    def test_resonance_negative(self):
        prev = translate_numeric_to_symbolic([0.1, 0.2, 0.3])
        curr = translate_numeric_to_symbolic([0.3, 0.2, 0.1])
        metrics = advanced_crep_eval(curr, [prev])
        self.assertAlmostEqual(round(metrics["resonanz"], 5), -1.0)

    def test_emergence_cluster(self):
        sym = translate_numeric_to_symbolic([0.0, 1.0, 0.0, 1.0])
        metrics = advanced_crep_eval(sym)
        self.assertGreater(metrics["emergenz_cluster"], 1)

if __name__ == "__main__":
    unittest.main()
