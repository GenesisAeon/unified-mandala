from __future__ import annotations

"""Simple fusion-based evolution utilities.

This module offers lightweight helpers that combine two energy
populations into a new fused population.  It is intentionally
minimal and serves as a placeholder for more advanced simulations
referenced in the project roadmaps.
"""

from typing import List


def fusion_step(core_a: float, core_b: float, rate: float = 0.5) -> float:
    """Fuse two energy cores.

    Args:
        core_a: Energy value of the first core.
        core_b: Energy value of the second core.
        rate: Fraction of ``core_b`` absorbed by ``core_a``.

    Returns:
        New energy after fusion.
    """

    return core_a + rate * core_b


def evolve_population(pop_a: List[float], pop_b: List[float], rate: float = 0.5) -> List[float]:
    """Evolve two populations through pairwise fusion.

    The populations are fused element wise using :func:`fusion_step`.  If the
    populations have different lengths, leftover values from the longer list are
    appended unchanged.

    Args:
        pop_a: First population of energy values.
        pop_b: Second population of energy values.
        rate: Fraction of energy transferred from ``pop_b`` to ``pop_a``.

    Returns:
        List of fused energy values.
    """

    length = min(len(pop_a), len(pop_b))
    fused = [fusion_step(pop_a[i], pop_b[i], rate) for i in range(length)]
    if len(pop_a) > length:
        fused.extend(pop_a[length:])
    elif len(pop_b) > length:
        fused.extend(pop_b[length:])
    return fused


__all__ = ["fusion_step", "evolve_population"]

