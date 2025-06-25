import unittest

from aeon_processor import assign_symbol


class TestAssignSymbol(unittest.TestCase):
    def test_symbol_thresholds(self):
        self.assertEqual(assign_symbol([0.9]), "\u2600")
        self.assertEqual(assign_symbol([0.6]), "\U0001F331")
        self.assertEqual(assign_symbol([0.3]), "\U0001F4A7")
        self.assertEqual(assign_symbol([0.1]), "\u26AB")


if __name__ == "__main__":
    unittest.main()
