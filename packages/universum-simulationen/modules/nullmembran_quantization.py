from __future__ import annotations

"""Nullmembran quantization utilities for universum-simulationen.

This module provides small helper functions for generating starting
conditions and performing a simple binary reproduction step used in
various simulation prototypes.  The implementation is intentionally
lightweight to serve as an educational example within the repository."""

from typing import List, Optional
import random


def start_conditions(seed: Optional[int] = None) -> List[int]:
    """Generate initial binary state for the simulation.

    Args:
        seed: Optional random seed to make the output deterministic.

    Returns:
        A list with two binary quanta (0 or 1).
    """

    rng = random.Random(seed)
    return [rng.randint(0, 1) for _ in range(2)]


def binary_reproduction(state: List[int]) -> List[int]:
    """Duplicate each bit to model binary reproduction.

    Args:
        state: Sequence of binary values consisting solely of ``0`` or ``1``.

    Returns:
        New state where each bit is duplicated (e.g. ``[0, 1]`` -> ``[0, 0, 1, 1]``).
    """

    if any(bit not in (0, 1) for bit in state):
        raise ValueError("state must contain only 0 or 1")

    return [bit for bit in state for _ in (0, 1)]


__all__ = ["start_conditions", "binary_reproduction"]
