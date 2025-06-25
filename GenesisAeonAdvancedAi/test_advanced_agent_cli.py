import os
import tempfile
import unittest
from pathlib import Path
import subprocess
import sys

class TestAdvancedAgentCLI(unittest.TestCase):
    def test_custom_paths(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            log_file = Path(tmpdir) / "custom_log.yaml"
            state_file = Path(tmpdir) / "custom_state.yaml"
            symbol_file = Path(tmpdir) / "symbols.yaml"
            subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "GenesisAeonAdvancedAi.advanced_agent",
                    "--input",
                    "data",
                    "--log-file",
                    str(log_file),
                    "--state-file",
                    str(state_file),
                    "--symbol-memory-file",
                    str(symbol_file),
                ],
                check=True,
            )
            self.assertTrue(log_file.exists())
            self.assertTrue(state_file.exists())
            self.assertTrue(symbol_file.exists())
            import yaml
            data = yaml.safe_load(symbol_file.read_text())
            self.assertIsInstance(data, dict)

    def test_haiku_output(self):
        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "GenesisAeonAdvancedAi.advanced_agent",
                "--input",
                "data",
                "--haiku",
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertIn("\n", result.stdout)

if __name__ == "__main__":
    unittest.main()
