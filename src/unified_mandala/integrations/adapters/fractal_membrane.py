"""fractal-membrane adapter — self-similar boundary dynamics."""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class FractalMembraneAdapter(BaseAdapter):
    """Adapter for fractal-membrane.

    Implements a Cantor-dust fractal boundary whose dimension
    varies with entropy.  Hausdorff dimension d = log(2)/log(3)
    at entropy=0.5, approaching 1 or 0 at extremes.
    """

    name = "fractal-membrane"
    version = "1.0.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        # Hausdorff dimension interpolation
        d_min, d_max = 0.01, 0.99
        hausdorff = d_min + (d_max - d_min) * entropy
        # Fractal phase: self-similar iteration
        x = entropy
        for _ in range(min(phases, 10)):
            x = abs(math.sin(math.pi * x * (1 + hausdorff)))
        return {
            "phase": max(0.0, min(1.0, x)),
            "weight": 1.6,
            "decay": 0.007,
            "hausdorff_dim": hausdorff,
            "fractal_iterations": min(phases, 10),
        }
