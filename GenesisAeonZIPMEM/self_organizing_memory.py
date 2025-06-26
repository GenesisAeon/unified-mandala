"""Self-organizing memory management for AeonSealAI."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, List, Dict


@dataclass
class MemoryEntry:
    time: str
    crep: float
    feedback: float | None = None
    symbol: str | None = None
    strategy: str | None = None
    sealcore_snapshot: Dict[str, Any] | None = None
    todos: List[str] | None = None
    meta: Dict[str, Any] | None = None


class SelfOrganizingMemory:
    """Store memory entries and periodically review trends."""

    def __init__(self) -> None:
        self.entries: List[MemoryEntry] = []

    def add(self, entry: Dict[str, Any]) -> None:
        """Add a memory entry and trigger review every 10 items."""
        complete = MemoryEntry(time=entry.get("time", datetime.now().isoformat()),
                              crep=entry.get("crep", 0.0),
                              feedback=entry.get("feedback"),
                              symbol=entry.get("symbol"),
                              strategy=entry.get("strategy"),
                              sealcore_snapshot=entry.get("sealcore_snapshot"),
                              todos=entry.get("todos"),
                              meta=entry.get("meta"))
        self.entries.append(complete)
        if len(self.entries) % 10 == 0:
            self.review()

    def review(self) -> Dict[str, Any]:
        """Return average CREP and symbol distribution of last 10 entries."""
        window = self.entries[-10:]
        if not window:
            return {"avg_crep": 0.0, "symbol_counts": {}}
        avg_crep = sum(e.crep for e in window) / len(window)
        symbol_counts: Dict[str, int] = {}
        for e in window:
            sym = e.symbol or "\u25CB"
            symbol_counts[sym] = symbol_counts.get(sym, 0) + 1
        if avg_crep < 0.5:
            self.trigger_adaptation()
        return {"avg_crep": avg_crep, "symbol_counts": symbol_counts}

    def trigger_adaptation(self) -> None:
        """Placeholder for adaptation trigger."""
        print("Adapting strategy due to low CREP...")
