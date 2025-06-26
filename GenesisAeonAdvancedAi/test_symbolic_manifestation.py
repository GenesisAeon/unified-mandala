import unittest

from GenesisAeonAdvancedAi.aeon_processor import symbolic_manifestation


class TestSymbolicManifestation(unittest.TestCase):
    def test_manifest_keys(self):
        result = symbolic_manifestation([0.1, 0.2, 0.3])
        self.assertIn("symbolic", result)
        self.assertIn("haiku", result)
        self.assertIn("color", result)


if __name__ == "__main__":
    unittest.main()
