import json
import tempfile
import unittest
from pathlib import Path

from GenesisAeonAdvancedAi.sigil_loader import load_sigil


class TestSigilLoader(unittest.TestCase):
    def test_load_valid(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "sigil.json"
            path.write_text('{"sigillin": {"id": "TEST"}}')
            data = load_sigil(path)
            self.assertIn("sigillin", data)

    def test_missing_file(self):
        with self.assertRaises(FileNotFoundError):
            load_sigil(Path("nonexistent.json"))

    def test_invalid_json(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "bad.json"
            path.write_text('{invalid}')
            with self.assertRaises(ValueError):
                load_sigil(path)


if __name__ == "__main__":
    unittest.main()
