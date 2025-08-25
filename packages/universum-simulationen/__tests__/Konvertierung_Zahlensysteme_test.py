import importlib.util
import sys
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "modules" / "Konvertierung_Zahlensysteme.py"
spec = importlib.util.spec_from_file_location("Konvertierung_Zahlensysteme", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)

convert = mod.convert


class TestZahlensystemKonverter(unittest.TestCase):
    def test_decimal_to_binary(self):
        self.assertEqual(convert("10", "decimal", "binary"), "1010")

    def test_hex_to_decimal(self):
        self.assertEqual(convert("ff", "hex", "decimal"), "255")

    def test_decimal_to_phi_and_back(self):
        phi = convert("10", "decimal", "phi")
        self.assertEqual(phi, "10010")
        self.assertEqual(convert(phi, "phi", "decimal"), "10")

    def test_binary_to_hex(self):
        self.assertEqual(convert("1010", "binary", "hex"), "a")


if __name__ == "__main__":
    unittest.main()
