"""mirror-machine adapter — reflective loop processing."""

from __future__ import annotations

from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class MirrorMachineAdapter(BaseAdapter):
    """Adapter for mirror-machine.

    Implements a reflective feedback loop: φ_n = f(φ_{n-1}) where
    f is a logistic map, creating chaotic self-mirroring at entropy > 0.7.
    """

    name = "mirror-machine"
    version = "1.0.0"

    _R_SCALE = 3.9  # logistic map parameter

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        x = entropy if 0.0 < entropy < 1.0 else 0.5
        r = self._R_SCALE * entropy + 0.1
        for _ in range(min(phases, 20)):
            x = r * x * (1.0 - x)
            x = max(1e-9, min(1.0 - 1e-9, x))
        return {
            "phase": x,
            "weight": 1.2,
            "decay": 0.01,
            "logistic_r": r,
            "reflections": phases,
        }
