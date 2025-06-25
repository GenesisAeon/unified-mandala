import unittest

from GenesisAeonAdvancedAi.aeon_processor import assign_symbol, generate_haiku


class TestAssignSymbol(unittest.TestCase):
    def test_symbol_thresholds(self):
        self.assertEqual(assign_symbol([0.9]), "\u2600")
        self.assertEqual(assign_symbol([0.6]), "\U0001F331")
        self.assertEqual(assign_symbol([0.3]), "\U0001F4A7")
        self.assertEqual(assign_symbol([0.1]), "\u26AB")

    def test_generate_haiku(self):
        symbolic = {"symbol": "\u2600"}
        haiku = generate_haiku(symbolic)
        self.assertIn("golden light", haiku)


if __name__ == "__main__":
    unittest.main()
