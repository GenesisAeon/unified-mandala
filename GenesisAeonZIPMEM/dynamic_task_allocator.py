"""Allocate tasks dynamically based on CREP trends."""

from __future__ import annotations

from typing import Any, List, Dict


class DynamicTaskAllocator:
    """Simple task allocator influenced by average CREP."""

    def allocate(self, memory: List[Dict[str, Any]]) -> List[str]:
        window = memory[-10:]
        if not window:
            return ["Initialize"]
        creps = [entry.get("crep", 0.0) for entry in window]
        avg_crep = sum(creps) / len(creps)
        if avg_crep < 0.4:
            return ["FeedbackLoop", "Neue Symbolik testen"]
        if avg_crep > 0.7:
            return ["ClusterExpand", "CommunitySync"]
        return ["StandardReview", "CREPMonitor"]
