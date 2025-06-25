import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
import importlib.util

try:
    import yaml  # type: ignore
    HAS_YAML = True
except Exception:
    HAS_YAML = False


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

    @unittest.skipUnless(HAS_YAML, "PyYAML not installed")
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
            if HAS_YAML:
                data = yaml.safe_load(result.stdout)
                self.assertTrue("symbolic" in data or "result" in data)

    def test_metrics_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.3 0.4")
            cli_path = Path(__file__).resolve().parent / "aeon_cli.py"
            result = subprocess.run(
                [sys.executable, str(cli_path), "--input", str(input_path), "--metrics"],
                capture_output=True,
                text=True,
                check=True,
            )
            data = json.loads(result.stdout)
            self.assertIn("metrics", data)

    def test_yaml_fallback_warning(self):
        import io
        from unittest import mock
        cli_dir = Path(__file__).resolve().parent
        sys.path.insert(0, str(cli_dir))
        try:
            aeon_cli = importlib.import_module("aeon_cli")
        finally:
            sys.path.pop(0)

        with mock.patch.object(aeon_cli, "_HAS_YAML", False), \
             mock.patch.object(aeon_cli, "yaml", None), \
             mock.patch("sys.stdout", new_callable=io.StringIO) as buf:
            aeon_cli.main(["1", "--yaml"])
            output = buf.getvalue()

        self.assertIn("PyYAML not installed", output)
        lines = output.splitlines()
        data = json.loads("\n".join(lines[1:]))
        self.assertTrue("symbolic" in data or "result" in data)
