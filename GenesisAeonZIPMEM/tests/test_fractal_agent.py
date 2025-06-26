from GenesisAeonZIPMEM.fractal_agent import FractalAgent


def test_agent_records_last_memory():
    agent = FractalAgent(focus="test")
    memory = [{"id": 1}, {"id": 2}]
    agent.step(memory, None)
    assert agent.state["last_memory"] == memory[-1]
