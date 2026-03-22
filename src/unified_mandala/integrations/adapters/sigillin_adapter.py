"""sigillin adapter — eigenfunction resonance interface."""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class SigillinAdapter(BaseAdapter):
    """Adapter for sigillin package.

    Exposes the Sigillin eigenfunction Ψ(s) sampled at entropy.
    The eigenfuction approximation uses a Hermite polynomial expansion.
    """

    name = "sigillin"
    version = "1.0.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        # H₂(x) = 4x² - 2  normalised to [0,1]
        x = entropy * 2 - 1  # map [0,1] → [-1,1]
        h2 = 4 * x**2 - 2
        psi = (h2 + 6) / 12.0  # normalise to [0,1]
        phi_integral = psi * abs(math.sin(entropy * math.pi * phases))
        return {
            "phase": max(0.0, min(1.0, phi_integral)),
            "weight": 2.5,
            "decay": 0.001,
            "hermite_h2": h2,
            "psi": psi,
        }
