import unittest

from GenesisAeonAdvancedAi.aeon_processor import (
    assign_symbol,
    generate_haiku,
    generate_poetic_commentary,
)


class TestAssignSymbol(unittest.TestCase):
    def test_symbol_thresholds(self):
        self.assertEqual(assign_symbol([0.9]), "\u2600")
        self.assertEqual(assign_symbol([0.6]), "\U0001F331")
        self.assertEqual(assign_symbol([0.3]), "\U0001F4A7")
        self.assertEqual(assign_symbol([0.1]), "\u26AB")

    def test_archetype_context(self):
        sym = assign_symbol([0.1], context="stress")
        self.assertEqual(sym, "🕳️")

    def test_generate_haiku(self):
        symbolic = {"symbol": "\u2600"}
        haiku = generate_haiku(symbolic)
        self.assertIn("golden light", haiku)

    def test_poetic_commentary(self):
        metrics = {"kohärenz": 0.9, "resonanz": 0.9, "emergenz": 0.9, "präsenz": 0.9}
        comment = generate_poetic_commentary(metrics)
        self.assertEqual(comment, "resonant patterns bloom")


if __name__ == "__main__":
    unittest.main()
