"""sonification adapter — musical resonance phase."""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class SonificationAdapter(BaseAdapter):
    """Adapter for sonification.

    Maps the mandala entropy to a musical interval ratio using
    just-intonation frequency relationships.
    """

    name = "sonification"
    version = "1.0.0"

    # Just-intonation ratios for a major scale
    _JI_RATIOS = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2]

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        idx = int(entropy * (len(self._JI_RATIOS) - 1))
        ratio = self._JI_RATIOS[idx]
        # Phase = normalised frequency ratio deviation from unison
        phase = (ratio - 1.0) / 1.0  # maps [1, 2] → [0, 1]
        # Add harmonic shimmer from phases
        shimmer = math.sin(entropy * math.pi * phases) * 0.1
        return {
            "phase": max(0.0, min(1.0, phase + shimmer)),
            "weight": 1.2,
            "decay": 0.004,
            "ji_ratio": ratio,
            "scale_degree": idx,
        }
