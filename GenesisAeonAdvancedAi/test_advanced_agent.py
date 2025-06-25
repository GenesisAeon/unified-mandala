import os
import tempfile
import unittest
from pathlib import Path

import yaml

from GenesisAeonAdvancedAi.advanced_agent import AdvancedAeonAgent, dump_yaml


class TestAdvancedAeonAgent(unittest.TestCase):
    def test_act_persists_log(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            cwd = os.getcwd()
            os.chdir(tmpdir)
            try:
                agent = AdvancedAeonAgent("test_agent", {})
                result = agent.act("data")
                self.assertIn("symbol", result)
                log_file = Path("test_agent_log.yaml")
                self.assertTrue(log_file.exists())
                data = list(yaml.safe_load_all(log_file.read_text()))
                self.assertGreaterEqual(len(data), 1)
            finally:
                os.chdir(cwd)

    def test_dump_yaml(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            cwd = os.getcwd()
            os.chdir(tmpdir)
            try:
                agent = AdvancedAeonAgent("test_agent", {"a": 1})
                dump_yaml(agent)
                state_file = Path("test_agent_state.yaml")
                self.assertTrue(state_file.exists())
                content = yaml.safe_load(state_file.read_text())
                self.assertEqual(content.get("a"), 1)
            finally:
                os.chdir(cwd)


if __name__ == "__main__":
    unittest.main()
