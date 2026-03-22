"""advanced-weighting-systems adapter — earth-integration weighting."""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class AdvancedWeightingAdapter(BaseAdapter):
    """Adapter for advanced-weighting-systems.

    Applies Gaussian-weighted phase integration where each phase bin
    is weighted by its distance from the entropy centroid.
    """

    name = "advanced-weighting-systems"
    version = "1.0.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        sigma = 0.3
        centroid = entropy
        weights_raw = [
            math.exp(-0.5 * ((i / max(phases - 1, 1) - centroid) / sigma) ** 2)
            for i in range(max(phases, 1))
        ]
        total = sum(weights_raw) or 1.0
        phase = sum(w / total * (i / max(phases - 1, 1)) for i, w in enumerate(weights_raw))
        return {
            "phase": max(0.0, min(1.0, phase)),
            "weight": 1.3,
            "decay": 0.006,
            "gaussian_sigma": sigma,
            "centroid": centroid,
        }
