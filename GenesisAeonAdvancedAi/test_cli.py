import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


class TestAeonCLI(unittest.TestCase):
    def test_input_file(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.1 0.2 0.3")
            cli_path = Path(__file__).resolve().parent / "aeon_cli.py"
            result = subprocess.run(
                [sys.executable, str(cli_path), "--input", str(input_path), "-d", "2"],
                capture_output=True,
                text=True,
                check=True,
            )
            data = json.loads(result.stdout)
            self.assertTrue("symbolic" in data or "result" in data)

    def test_with_sigil(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.1")
            sigil_path = Path(tmpdir) / "sigil.json"
            sigil_path.write_text('{"sigillin": {"id": "TEST"}}')
            cli_path = Path(__file__).resolve().parent / "aeon_cli.py"
            result = subprocess.run(
                [sys.executable, str(cli_path), "--input", str(input_path), "--sigil", str(sigil_path)],
                capture_output=True,
                text=True,
                check=True,
            )
            data = json.loads(result.stdout)
            self.assertIn("sigil", data)

    def test_yaml_output(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.2")
            cli_path = Path(__file__).resolve().parent / "aeon_cli.py"
            result = subprocess.run(
                [sys.executable, str(cli_path), "--input", str(input_path), "--yaml"],
                capture_output=True,
                text=True,
                check=True,
            )
            import yaml
            data = yaml.safe_load(result.stdout)
            self.assertTrue("symbolic" in data or "result" in data)
