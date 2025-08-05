from __future__ import annotations

"""SymbolMapper Agent

This module provides utilities to map numeric and textual inputs to symbolic
Unicode glyphs. It can be used by other agents to translate raw data into the
Sigillin symbolism used throughout the project.
"""

from dataclasses import dataclass, field
from typing import Iterable, List, Dict

GLYPHS: List[str] = ["○", "∆", "ψ", "★"]
KEYWORDS: Dict[str, str] = {
    "erweckung": "★",
    "krise": "∆",
    "psi": "ψ",
    "kreis": "○",
}


def map_numeric_to_symbol(values: Iterable[float]) -> str:
    """Map a sequence of numeric values to a glyph.

    The mean of the values is scaled to the index of the ``GLYPHS`` list.
    Values outside the 0..1 range are clamped.
    """

    vals = list(values)
    if not vals:
        raise ValueError("values must not be empty")
    mean = sum(vals) / len(vals)
    mean = max(0.0, min(1.0, mean))
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
