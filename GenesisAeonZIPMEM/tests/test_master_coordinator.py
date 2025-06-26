from GenesisAeonZIPMEM.fractal_agent import FractalAgent
from GenesisAeonZIPMEM.master_coordinator import MasterCoordinator


def test_coordinator_calls_agents():
    agent1 = FractalAgent(focus="a")
    agent2 = FractalAgent(focus="b")
    coord = MasterCoordinator([agent1, agent2])
    memory = [{"foo": "bar"}]
    coord.orchestrate(memory, None)
    assert agent1.state["last_memory"] == memory[-1]
    assert agent2.state["last_memory"] == memory[-1]
