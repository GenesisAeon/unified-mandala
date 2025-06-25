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
            result = subprocess.run(
                [sys.executable, "aeon_cli.py", "--input", str(input_path), "-d", "2"],
                capture_output=True,
                text=True,
                check=True,
            )
            data = json.loads(result.stdout)
            self.assertTrue("symbolic" in data or "result" in data)
