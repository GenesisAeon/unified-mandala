"""field-resonance adapter — star-burst field topology."""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class FieldResonanceAdapter(BaseAdapter):
    """Adapter for field-resonance.

    Computes a star-burst interference pattern from N = phases point sources
    arranged on a unit circle, each radiating at angular frequency ω = entropy·π.
    """

    name = "field-resonance"
    version = "1.0.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        n = max(1, phases)
        omega = entropy * math.pi
        # Superposition of N sources: |Σ e^{iωk}|² / N²
        re_sum = sum(math.cos(omega * k) for k in range(n))
        im_sum = sum(math.sin(omega * k) for k in range(n))
        intensity = (re_sum**2 + im_sum**2) / (n**2)
        return {
            "phase": max(0.0, min(1.0, intensity)),
            "weight": 1.5,
            "decay": 0.005,
            "n_sources": n,
            "re_sum": re_sum,
            "im_sum": im_sum,
        }
