import os
import tempfile
import unittest
import yaml

from GenesisAeonAdvancedAi.aeon_logger import log_event


class TestAeonLogger(unittest.TestCase):
    def test_log_event_creates_file(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            cwd = os.getcwd()
            os.chdir(tmpdir)
            try:
                log_event("agent", "input", {"d": 1})
                self.assertTrue(os.path.exists("agent_log.yaml"))
                content = yaml.safe_load(open("agent_log.yaml", "r", encoding="utf-8").read())
                self.assertIsInstance(content, list)
                self.assertGreater(len(content), 0)
            finally:
                os.chdir(cwd)


if __name__ == "__main__":
    unittest.main()
