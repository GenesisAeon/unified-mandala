from __future__ import annotations

"""Nullmembran dynamics utilities for universum-simulationen.

This lightweight module provides helper functions to model a
very small step of membrane dynamics with damping.  It is
intended as an educational placeholder that can be expanded in
future fractal runs.
"""

from typing import Iterable, List


def step(state: Iterable[float], force: float, damping: float = 0.1) -> List[float]:
    """Apply a single dynamic step to the membrane state.

    Each value is shifted by ``force`` and then reduced by the
    ``damping`` factor to simulate energy loss.

    Args:
        state: Current membrane displacements.
        force: External force applied uniformly to all elements.
        damping: Fraction of displacement lost per step.

    Returns:
        List of updated membrane values.
    """

    return [(1 - damping) * (value + force) for value in state]


def oscillate(initial: float, steps: int, force: float = 0.0, damping: float = 0.1) -> List[float]:
    """Simulate repeated :func:`step` operations.

    Args:
        initial: Starting displacement.
        steps: Number of iterations to perform.
        force: External force applied each step.
        damping: Damping factor passed to :func:`step`.

    Returns:
        History of displacements including the initial value.
    """

    history = [initial]
    current = initial
    for _ in range(steps):
        current = step([current], force, damping)[0]
        history.append(current)
    return history


__all__ = ["step", "oscillate"]
