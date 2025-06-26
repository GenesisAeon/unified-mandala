"""AeonSealAI system combining AdvancedAeonAgent with SealCore."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict

from GenesisAeonAdvancedAi.advanced_agent import AdvancedAeonAgent, generate_basic_haiku

from .advanced_ai_system import AdvancedAISelfLearnSystem


class AeonSealAI(AdvancedAISelfLearnSystem):
    """Self-learning AI that wraps an AdvancedAeonAgent and SealCore."""

    def __init__(self, agent_name: str = "aeon_seal") -> None:
        super().__init__()
        self.agent = AdvancedAeonAgent(agent_name)

    def process(self, input_data: Any, feedback: float | None = None) -> Dict[str, Any]:
        """Process *input_data* through the agent and store a memory entry."""
        result = self.agent.act(input_data)
        seal_snapshot = self.sealcore.adapt([e.__dict__ for e in self.memory.entries])
        todos = self.allocator.allocate([e.__dict__ for e in self.memory.entries])
        self.coordinator.orchestrate([e.__dict__ for e in self.memory.entries], self.sealcore)
        entry = {
            "time": datetime.now().isoformat(),
            "crep": self.estimate_crep(),
            "feedback": feedback or self.get_feedback(),
            "symbol": result["symbol"],
            "strategy": seal_snapshot["strategy"],
            "sealcore_snapshot": seal_snapshot,
            "todos": todos,
            "haiku": generate_basic_haiku(result["symbol"]),
        }
        self.memory.add(entry)
        return entry
