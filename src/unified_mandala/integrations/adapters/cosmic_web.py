"""cosmic-web adapter — filament network topology."""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class CosmicWebAdapter(BaseAdapter):
    """Adapter for cosmic-web.

    Models large-scale structure using a Bessel-function filament
    density.  High entropy corresponds to denser cosmic web nodes.
    """

    name = "cosmic-web"
    version = "1.0.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        # J₀(x) ≈ 1 - x²/4 for small x; use normalised Bessel-like approx
        x = entropy * math.pi * 2
        j0_approx = math.cos(x) / (1.0 + 0.1 * x)
        phase = (j0_approx + 1.0) / 2.0
        filament_count = max(1, int(phases * entropy))
        return {
            "phase": max(0.0, min(1.0, phase)),
            "weight": 1.6,
            "decay": 0.004,
            "filament_count": filament_count,
            "bessel_approx": j0_approx,
        }
