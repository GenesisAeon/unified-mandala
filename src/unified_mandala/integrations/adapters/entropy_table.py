"""entropy-table adapter — structured chaos lookup."""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter


class EntropyTableAdapter(BaseAdapter):
    """Adapter for entropy-table.

    Uses a pre-computed table approach (approximated here by
    trigonometric interpolation) to map (entropy, phases) to a
    structured resonance value.
    """

    name = "entropy-table"
    version = "1.0.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        # Structured lookup via 2D trig interpolation
        row = entropy * 8  # 8 discrete entropy bins
        col = (phases % 8) / 8.0
        phase = abs(math.sin(row + col * math.pi))
        structured = (phase + abs(math.cos(row * col))) / 2.0
        return {
            "phase": max(0.0, min(1.0, structured)),
            "weight": 1.1,
            "decay": 0.009,
            "table_row": row,
            "table_col": col,
        }
