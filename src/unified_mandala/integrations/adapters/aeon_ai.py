"""aeon-ai v0.2.0 adapter — stellar intelligence layer."""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class AeonAiAdapter(BaseAdapter):
    """Adapter for aeon-ai v0.2.0.

    Integrates the Aeon neural inference engine.  The stellar phase is
    modulated by a softmax-like normalization of entropy x phases.
    """

    name = "aeon-ai"
    version = "0.2.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        # Softmax-style normalisation over phase indices
        logits = [math.exp(entropy * (i + 1) / max(phases, 1)) for i in range(phases)]
        total = sum(logits)
        probs = [v / total for v in logits]
        phase = sum(p * (i + 1) / phases for i, p in enumerate(probs))
        return {
            "phase": max(0.0, min(1.0, phase)),
            "weight": 1.8,
            "decay": 0.003,
            "inference_phase_count": phases,
            "logit_max": max(logits),
        }
