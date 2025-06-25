from __future__ import annotations

from pathlib import Path
from typing import Iterable, Dict, Any, List

from aeon_processor import fraktal_feedback_metrics
from trikaya import trikaya_state
from memory_store import store_result


class AeonAgent:
    """Simple agent orchestrating fractal feedback and storing results."""

    def __init__(self, memory: List[Dict[str, Any]] | None = None) -> None:
        self.memory: List[Dict[str, Any]] = list(memory) if memory else []

    def act(self, input_values: Iterable[float], depth: int = 3) -> tuple[str, Dict[str, Any]]:
        """Process input and decide an action.

        Parameters
        ----------
        input_values:
            Iterable of numeric values.
        depth:
            Depth for the fractal feedback loop.
        Returns
        -------
        Tuple of chosen action string and the stored record.
        """
        symbolic, score, metrics = fraktal_feedback_metrics(
            list(input_values), depth=depth, prev_states=self.memory[-1:] if self.memory else None
        )
        record = {
            "symbolic": symbolic,
            "crep_score": score,
            "metrics": metrics,
            "trikaya_state": trikaya_state(score),
        }
        action = "Beobachten"
        if score == 1:
            action = "Kooperation anbieten"
        elif score == -1:
            action = "Selbst-Reset"
        record["action"] = action
        self.memory.append(record)
        return action, record

    def persist(self, path: Path) -> None:
        """Persist memory to a JSON file using :func:`store_result`."""
        for entry in self.memory:
            store_result(entry, path)
