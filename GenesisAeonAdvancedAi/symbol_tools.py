"""Utility functions for symbolic color and shape mapping."""

from typing import Any


def assign_color(value: float) -> str:
    """Return a color name based on threshold values."""
    if value > 0.8:
        return "gold"
    if value > 0.5:
        return "blue"
    return "grey"


def transform_to_symbol(data: Any) -> str:
    """Map Python data types to simple symbolic markers."""
    if isinstance(data, dict):
        return "\u0394"  # Δ
    if isinstance(data, str):
        return "\u03C8"  # ψ
    return "\u25CF"  # ●
