from __future__ import annotations

"""Estimate radiation influence of a supernova.

This lightweight module provides a helper function that estimates
how much radiation from a distant supernova affects a target region.
It is intentionally simple and serves as a placeholder for more
detailed astrophysical models referenced in future tasks.
"""

import math
from typing import Iterable, List


def radiation_influence(distance: float, energy: float, attenuation: float = 2.0) -> float:
    """Compute radiation influence at ``distance`` given ``energy``.

    The model assumes isotropic radiation with a power-law attenuation.

    Args:
        distance: Distance from the supernova in arbitrary units.
        energy: Radiated energy value.
        attenuation: Exponent controlling intensity falloff (default ``2.0``).

    Returns:
        Estimated radiation level at the target distance.
    """

    if distance <= 0:
        raise ValueError("distance must be positive")
    if attenuation <= 0:
        raise ValueError("attenuation must be positive")
    return energy / (distance ** attenuation)


def batch_influence(distances: Iterable[float], energy: float, attenuation: float = 2.0) -> List[float]:
    """Apply :func:`radiation_influence` to a list of distances."""
    return [radiation_influence(d, energy, attenuation) for d in distances]


__all__ = ["radiation_influence", "batch_influence"]
