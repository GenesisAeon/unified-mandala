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
                ],
                check=True,
            )
            self.assertTrue(log_file.exists())
            self.assertTrue(state_file.exists())

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
