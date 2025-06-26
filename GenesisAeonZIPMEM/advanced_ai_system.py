"""High level AeonSealAI self learning loop."""

from __future__ import annotations

from datetime import datetime
from typing import Any, List, Dict

from .seal_core import SealCore
from .self_organizing_memory import SelfOrganizingMemory
from .dynamic_task_allocator import DynamicTaskAllocator
from .fractal_agent import FractalAgent
from .master_coordinator import MasterCoordinator

def basic_haiku(symbol: str) -> str:
    """Return a small deterministic haiku for *symbol* (borrowed from AdvancedAI)."""
    if symbol == "\u0394":
        return (
            "change weaves its path\n"
            "memory traces interlace\n"
            "delta guides the flow"
        )
    return (
        "nested loops unfold\n"
        "reflections echo the core\n"
        "nabla draws us in"
    )


class AdvancedAISelfLearnSystem:
    """Combine memory, sealcore and agents."""

    def __init__(self) -> None:
        self.memory = SelfOrganizingMemory()
        self.sealcore = SealCore()
        self.allocator = DynamicTaskAllocator()
        self.agents = [FractalAgent(focus="CREP"), FractalAgent(focus="Symbolik")]
        self.coordinator = MasterCoordinator(self.agents)

    def estimate_crep(self) -> float:
        return 0.5

    def get_feedback(self) -> float:
        return 0.5

    def mainloop(self, feedback: float | None = None) -> Dict[str, Any]:
        seal_snapshot = self.sealcore.adapt([e.__dict__ for e in self.memory.entries])
        todos = self.allocator.allocate([e.__dict__ for e in self.memory.entries])
        self.coordinator.orchestrate([e.__dict__ for e in self.memory.entries], self.sealcore)
        entry = {
            "time": datetime.now().isoformat(),
            "crep": self.estimate_crep(),
            "feedback": feedback or self.get_feedback(),
            "symbol": seal_snapshot["active_symbol"],
            "strategy": seal_snapshot["strategy"],
            "sealcore_snapshot": seal_snapshot,
            "todos": todos,
            "haiku": basic_haiku(seal_snapshot["active_symbol"]),
        }
        self.memory.add(entry)
        return entry
