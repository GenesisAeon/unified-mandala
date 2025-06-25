"""Trikaya factorization utilities."""

from __future__ import annotations

from typing import Literal


TRIKAYA_STATES = {
    1: "PRÄSENZ",
    0: "LEERE",
    -1: "AUFLÖSUNG",
}


def trikaya_state(score: int) -> Literal["PRÄSENZ", "LEERE", "AUFLÖSUNG", "UNBEKANNT"]:
    """Map a CREP score to a Trikaya state."""
    return TRIKAYA_STATES.get(score, "UNBEKANNT")

