"""entropy-governance adapter — infinite balance controller."""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class EntropyGovernanceAdapter(BaseAdapter):
    """Adapter for entropy-governance.

    Provides the governance entropy signal using a PID-inspired
    control law that drives the system toward entropy = 0.5 (balance).
    """

    name = "entropy-governance"
    version = "1.0.0"

    _TARGET = 0.5
    _KP = 0.8
    _KI = 0.1
    _integral: float = 0.0

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        error = self._TARGET - entropy
        self._integral = max(-1.0, min(1.0, self._integral + error * 0.1))
        correction = self._KP * error + self._KI * self._integral
        phase = max(0.0, min(1.0, entropy + correction * 0.5))
        return {
            "phase": phase,
            "weight": 2.0,
            "decay": 0.002,
            "error": error,
            "integral": self._integral,
            "correction": correction,
        }
