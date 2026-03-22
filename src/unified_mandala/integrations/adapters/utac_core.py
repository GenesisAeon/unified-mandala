"""utac-core adapter — triune activation controller."""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class UtacCoreAdapter(BaseAdapter):
    """Adapter for utac-core.

    Implements the Triune Activation Controller: three interlocked
    oscillators (body/mind/spirit analogs) whose coherence determines
    the resonance phase.
    """

    name = "utac-core"
    version = "1.0.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        freq_body = entropy * 1.0
        freq_mind = entropy * 1.618
        freq_spirit = entropy * 2.618
        body = math.sin(freq_body * math.pi)
        mind = math.sin(freq_mind * math.pi)
        spirit = math.sin(freq_spirit * math.pi)
        coherence = (body + mind + spirit) / 3.0
        phase = (coherence + 1.0) / 2.0  # normalise [-1,1] → [0,1]
        return {
            "phase": max(0.0, min(1.0, phase)),
            "weight": 1.7,
            "decay": 0.005,
            "body": body,
            "mind": mind,
            "spirit": spirit,
            "coherence": coherence,
        }
