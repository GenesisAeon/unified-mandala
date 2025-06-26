import numpy as np
import yaml

SYMBOL_GLYPHS = ['\u25CB', '\u2206', '\u03C8', '\u2605']


def map_numeric_to_symbol(weights):
    """Map a sequence of weights to a symbol glyph."""
    idx = int(np.clip(np.mean(weights) * len(SYMBOL_GLYPHS), 0, len(SYMBOL_GLYPHS) - 1))
    return SYMBOL_GLYPHS[idx]


def map_text_to_glyph(text):
    """Return a glyph based on the presence of trigger keywords."""
    return '\u2605' if 'Erweckung' in text else '\u25CB'

