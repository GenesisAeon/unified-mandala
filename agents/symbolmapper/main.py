from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Iterable, List


@dataclass
class SymbolMapper:
    """Map numeric or textual signals to symbolic glyphs."""

    glyphs: List[str] = field(default_factory=lambda: ["○", "∆", "ψ", "★"])
    keyword_map: Dict[str, str] = field(
        default_factory=lambda: {
            "erweckung": "★",
            "change": "∆",
            "psi": "ψ",
        }
    )

    def map_numeric_to_symbol(self, values: Iterable[float]) -> str:
        """Return a glyph by averaging *values* and mapping into glyph list.

        The average is scaled to the glyph array length.
        """
        values_list = list(values)
        if not values_list:
            raise ValueError("values must not be empty")
        mean = sum(values_list) / len(values_list)
        index = min(int(mean * len(self.glyphs)), len(self.glyphs) - 1)
        return self.glyphs[index]

    def map_text_to_glyph(self, text: str) -> str:
        """Return a glyph based on keyword matches in *text*.

        If no keyword is found, the first glyph is returned as a neutral symbol.
        """
        lower = text.lower()
        for keyword, glyph in self.keyword_map.items():
            if keyword in lower:
                return glyph
        return self.glyphs[0]
