"""Master coordinator orchestrating fractal agents."""

from __future__ import annotations

from typing import Any, List, Dict

from .fractal_agent import FractalAgent


class MasterCoordinator:
    """Coordinate multiple agents and aggregate learning."""

    def __init__(self, agents: List[FractalAgent]) -> None:
        self.agents = agents

    def orchestrate(self, memory: List[Dict[str, Any]], sealcore: Any) -> None:
        for agent in self.agents:
            agent.step(memory, sealcore)
