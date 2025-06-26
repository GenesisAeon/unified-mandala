"""Master coordinator orchestrating fractal agents."""

from __future__ import annotations

from typing import Any, List, Dict

from .fractal_agent import FractalAgent


class MasterCoordinator:
    """Coordinate multiple agents and aggregate learning."""

    def __init__(self, agents: List[FractalAgent]) -> None:
        self.agents = agents
        self.performance_log: Dict[int, List[float]] = {id(a): [] for a in agents}

    def orchestrate(self, memory: List[Dict[str, Any]], sealcore: Any) -> None:
        for agent in self.agents:
            agent.step(memory, sealcore)

    def log_agent_performance(self, agent_id: int, result: float) -> None:
        """Record performance result for *agent_id*."""
        self.performance_log.setdefault(agent_id, []).append(result)

    def best_agent(self) -> FractalAgent | None:
        """Return agent with highest average logged result."""
        if not self.performance_log:
            return None
        best_id = max(
            self.performance_log,
            key=lambda k: (
                sum(self.performance_log[k]) / len(self.performance_log[k])
                if self.performance_log[k]
                else 0
            ),
        )
        for agent in self.agents:
            if id(agent) == best_id:
                return agent
        return None
