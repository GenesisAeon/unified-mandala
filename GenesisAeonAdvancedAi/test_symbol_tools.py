import unittest

from GenesisAeonAdvancedAi.symbol_tools import assign_color, transform_to_symbol


class TestSymbolTools(unittest.TestCase):
    def test_assign_color(self):
        self.assertEqual(assign_color(0.9), "gold")
        self.assertEqual(assign_color(0.6), "blue")
        self.assertEqual(assign_color(0.1), "grey")

    def test_transform_to_symbol(self):
        self.assertEqual(transform_to_symbol({}), "\u0394")
        self.assertEqual(transform_to_symbol("x"), "\u03C8")
        self.assertEqual(transform_to_symbol(123), "\u25CF")


if __name__ == "__main__":
    unittest.main()
