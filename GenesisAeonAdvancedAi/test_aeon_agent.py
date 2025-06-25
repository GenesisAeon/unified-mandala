import unittest
import pathlib

from aeon_agent import AeonAgent


class TestAeonAgent(unittest.TestCase):
    def test_act_records_memory(self):
        agent = AeonAgent()
        action, record = agent.act([0.1, 0.5, 0.9], depth=2)
        self.assertEqual(len(agent.memory), 1)
        self.assertIs(record, agent.memory[0])
        self.assertIn("action", record)
        self.assertIn("crep_score", record)

    def test_persist(self):
        agent = AeonAgent()
        agent.act([0.1])
        path = pathlib.Path('aeon_agent_mem.json')
        if path.exists():
            path.unlink()
        agent.persist(path)
        self.assertTrue(path.exists())
        path.unlink()


if __name__ == '__main__':
    unittest.main()
