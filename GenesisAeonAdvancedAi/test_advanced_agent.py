import os
import tempfile
import unittest
from pathlib import Path

import yaml

from GenesisAeonAdvancedAi.advanced_agent import AdvancedAeonAgent, dump_yaml
from GenesisAeonAdvancedAi.aeon_processor import translate_numeric_to_symbolic


class TestAdvancedAeonAgent(unittest.TestCase):
    def test_act_persists_log(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            cwd = os.getcwd()
            os.chdir(tmpdir)
            try:
                mem_path = Path("mem.json")
                agent = AdvancedAeonAgent("test_agent", {}, memory_path=str(mem_path))
                result = agent.act("data")
                self.assertIn("symbol", result)
                log_file = Path("test_agent_log.yaml")
                self.assertTrue(log_file.exists())
                data = list(yaml.safe_load_all(log_file.read_text()))
                self.assertGreaterEqual(len(data), 1)
                self.assertTrue(mem_path.exists())
                import json
                mem_data = json.loads(mem_path.read_text())
                self.assertGreaterEqual(len(mem_data), 1)
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

    def test_save_symbol_memory(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            cwd = os.getcwd()
            os.chdir(tmpdir)
            try:
                agent = AdvancedAeonAgent("test_agent", {})
                agent.act("data")
                mem_file = Path("symbols.yaml")
                agent.save_symbol_memory(str(mem_file))
                self.assertTrue(mem_file.exists())
                data = yaml.safe_load(mem_file.read_text())
                self.assertIn("\u2207", data)
            finally:
                os.chdir(cwd)

    def test_act_with_metrics(self):
        agent = AdvancedAeonAgent("test", {})
        out = agent.act_with_metrics(0.5)
        self.assertIn("metrics", out)


if __name__ == "__main__":
    unittest.main()
