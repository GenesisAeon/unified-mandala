import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

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
            result = subprocess.run(
                [sys.executable, "-m", "GenesisAeonAdvancedAi.aeon_cli", "--input", str(input_path), "-d", "2"],
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
            result = subprocess.run(
                [sys.executable, "-m", "GenesisAeonAdvancedAi.aeon_cli", "--input", str(input_path), "--sigil", str(sigil_path)],
                capture_output=True,
                text=True,
                check=True,
            )
            data = json.loads(result.stdout)
            self.assertIn("sigil", data)

    def test_start_sigil_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.1")
            result = subprocess.run(
                [sys.executable, "-m", "GenesisAeonAdvancedAi.aeon_cli", "--input", str(input_path), "--start-sigil"],
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
            result = subprocess.run(
                [sys.executable, "-m", "GenesisAeonAdvancedAi.aeon_cli", "--input", str(input_path), "--yaml"],
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
            result = subprocess.run(
                [sys.executable, "-m", "GenesisAeonAdvancedAi.aeon_cli", "--input", str(input_path), "--metrics"],
                capture_output=True,
                text=True,
                check=True,
            )
            data = json.loads(result.stdout)
            self.assertIn("metrics", data)

    def test_haiku_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.8")
            result = subprocess.run(
                [sys.executable, "-m", "GenesisAeonAdvancedAi.aeon_cli", "--input", str(input_path), "--haiku"],
                capture_output=True,
                text=True,
                check=True,
            )
            data = json.loads(result.stdout)
            self.assertIn("haiku", data)

    def test_yaml_fallback_warning(self):
        import io
        from unittest import mock
        from GenesisAeonAdvancedAi import aeon_cli

        with mock.patch.object(aeon_cli, "_HAS_YAML", False), \
             mock.patch.object(aeon_cli, "yaml", None), \
             mock.patch("sys.stdout", new_callable=io.StringIO) as buf:
            aeon_cli.main(["1", "--yaml"])
            output = buf.getvalue()

        self.assertIn("PyYAML not installed", output)
        lines = output.splitlines()
        data = json.loads("\n".join(lines[1:]))
        self.assertTrue("symbolic" in data or "result" in data)

    def test_graph_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.1 0.2 0.3")
            result = subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "GenesisAeonAdvancedAi.aeon_cli",
                    "--input",
                    str(input_path),
                    "--graph",
                ],
                capture_output=True,
                text=True,
                check=True,
            )
            data = json.loads(result.stdout)
            self.assertIn("graph", data)
            self.assertIn("nodes", data["graph"])

    def test_poetry_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.4 0.5")
            result = subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "GenesisAeonAdvancedAi.aeon_cli",
                    "--input",
                    str(input_path),
                    "--poetry",
                ],
                capture_output=True,
                text=True,
                check=True,
            )
            data = json.loads(result.stdout)
            self.assertIn("poetry", data)

    def test_summary_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.1")
            mem_file = Path(tmpdir) / "mem.json"
            subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "--input",
                str(input_path),
                "--memory",
                str(mem_file),
            ], check=True)
            result = subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "--summary",
                "--memory",
                str(mem_file),
            ], capture_output=True, text=True, check=True)
            data = json.loads(result.stdout)
            self.assertIn("crep_score", data)

    def test_tail_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.1 0.2")
            mem_file = Path(tmpdir) / "mem.json"
            # store two entries
            subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "--input",
                str(input_path),
                "--memory",
                str(mem_file),
            ], check=True)
            subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "--input",
                str(input_path),
                "--memory",
                str(mem_file),
            ], check=True)
            result = subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "--tail",
                "1",
                "--memory",
                str(mem_file),
            ], capture_output=True, text=True, check=True)
            data = json.loads(result.stdout)
            self.assertEqual(len(data), 1)

    def test_archetype_context_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = Path(tmpdir) / "vals.txt"
            input_path.write_text("0.8")
            config_path = Path(tmpdir) / "arch.yaml"
            config_path.write_text(
                """- context: test
  crep_min: 0.0
  crep_max: 0.0
  symbol: X
  meaning: Y
"""
            )
            result = subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "--input",
                str(input_path),
                "--archetype-context",
                "test",
                "--archetype-config",
                str(config_path),
            ], capture_output=True, text=True, check=True)
            data = json.loads(result.stdout)
            self.assertIn("archetype", data)
            self.assertEqual(data["archetype"].get("symbol"), "X")

    def test_trend_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            mem_file = Path(tmpdir) / "mem.json"
            subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "-1",
                "--memory",
                str(mem_file),
            ], check=True)
            subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "2",
                "--memory",
                str(mem_file),
            ], check=True)
            result = subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "--trend-key",
                "crep_score",
                "--memory",
                str(mem_file),
            ], capture_output=True, text=True, check=True)
            data = json.loads(result.stdout)
            self.assertIn("trend", data)

    def test_stats_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            mem_file = Path(tmpdir) / "mem.json"
            subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "0.1",
                "--memory",
                str(mem_file),
            ], check=True)
            subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "0.3",
                "--memory",
                str(mem_file),
            ], check=True)
            result = subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "--stats",
                "--memory",
                str(mem_file),
            ], capture_output=True, text=True, check=True)
            data = json.loads(result.stdout)
            self.assertIn("crep_score", data)
            self.assertIn("mean", data["crep_score"])

    def test_volatility_flag(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            mem_file = Path(tmpdir) / "mem.json"
            subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "1",
                "--memory",
                str(mem_file),
            ], check=True)
            subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "3",
                "--memory",
                str(mem_file),
            ], check=True)
            result = subprocess.run([
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.aeon_cli",
                "--volatility",
                "--memory",
                str(mem_file),
            ], capture_output=True, text=True, check=True)
            data = json.loads(result.stdout)
            self.assertIn("crep_score", data)
            self.assertGreater(data["crep_score"], 0)

