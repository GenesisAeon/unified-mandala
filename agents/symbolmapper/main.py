from __future__ import annotations

"""SymbolMapper Agent

This module provides utilities to map numeric and textual inputs to symbolic
Unicode glyphs. It can be used by other agents to translate raw data into the
Sigillin symbolism used throughout the project.
"""

from dataclasses import dataclass, field
from typing import Iterable, List, Dict, Any

try:  # Optional dependency used for array support
    import numpy as np
except Exception:  # pragma: no cover - numpy not available
    np = None  # type: ignore

GLYPHS: List[str] = ["○", "∆", "ψ", "★"]
KEYWORDS: Dict[str, str] = {
    "erweckung": "★",
    "krise": "∆",
    "psi": "ψ",
    "kreis": "○",
}


def map_numeric_to_symbol(values: Iterable[float] | Any) -> str:
    """Map numeric inputs to a glyph.

    Accepts any iterable of floats or a :class:`numpy.ndarray`. The values are
    clipped to ``0..1`` before calculating the mean that determines the glyph
    index.
    """

    if np is not None and hasattr(values, "__array__"):
        arr = np.array(values, dtype=float)  # type: ignore[attr-defined]
        if arr.size == 0:
            raise ValueError("values must not be empty")
        arr = np.clip(arr, 0.0, 1.0)  # type: ignore[attr-defined]
        mean = float(arr.mean())
    else:
        vals = list(values)  # type: ignore[arg-type]
        if not vals:
            raise ValueError("values must not be empty")
        vals = [max(0.0, min(1.0, v)) for v in vals]
        mean = sum(vals) / len(vals)
    idx = min(int(mean * len(GLYPHS)), len(GLYPHS) - 1)
    return GLYPHS[idx]


def map_text_to_glyph(text: str) -> str:
    """Map text content to a glyph based on keyword presence.

    The search is case-insensitive. If no keyword matches, the first glyph is
    returned as a default.
    """

    lower = text.lower()
    for keyword, glyph in KEYWORDS.items():
        if keyword in lower:
            return glyph
    return GLYPHS[0]


@dataclass
class SymbolMapper:
    """Wrapper class exposing mapping helpers with custom glyphs."""

    glyphs: List[str] = field(default_factory=lambda: GLYPHS.copy())
    keywords: Dict[str, str] = field(default_factory=lambda: KEYWORDS.copy())

    def map_numeric(self, values: Iterable[float]) -> str:
        return map_numeric_to_symbol(values)

    def map_text(self, text: str) -> str:
        for keyword, glyph in self.keywords.items():
            if keyword.lower() in text.lower():
                return glyph
        return self.glyphs[0]
