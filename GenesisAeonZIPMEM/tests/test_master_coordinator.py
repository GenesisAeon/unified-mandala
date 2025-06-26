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


def test_best_agent_returns_highest_score():
    agent1 = FractalAgent(focus="a")
    agent2 = FractalAgent(focus="b")
    coord = MasterCoordinator([agent1, agent2])
    coord.log_agent_performance(id(agent1), 0.2)
    coord.log_agent_performance(id(agent2), 0.8)
    assert coord.best_agent() is agent2
