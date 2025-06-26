import tempfile
import unittest
from pathlib import Path

from GenesisAeonAdvancedAi.archetype_tools import get_symbol


class TestArchetypeTools(unittest.TestCase):
    def test_match(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            cfg = Path(tmpdir) / "arch.yaml"
            cfg.write_text(
                """- context: test
  crep_min: 0.0
  crep_max: 0.5
  symbol: X
  meaning: Y
"""
            )
            sym, meaning = get_symbol(0.2, "test", cfg)
            self.assertEqual(sym, "X")
            self.assertEqual(meaning, "Y")

    def test_default(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            cfg = Path(tmpdir) / "arch.yaml"
            cfg.write_text("[]")
            sym, meaning = get_symbol(0.2, "none", cfg)
            self.assertEqual(sym, "⚫")
            self.assertEqual(meaning, "Unbestimmt")


if __name__ == "__main__":
    unittest.main()
