"""GreekMath adapter — symbolic Greek-letter mathematics resonance channel.

Maps the classical Greek symbolic mathematics tradition (Pythagorean harmonics,
Platonic solids, Archimedean spirals, Euclidean geometry) to CREP resonance
phases.  The adapter encodes how deeply a given entropy state resonates with
fundamental mathematical archetypes.

Implemented resonance primitives:

1. **Pythagorean harmony** — integer ratio proximity of entropy to 1/2, 2/3, 3/4
2. **Golden section** — proximity to φ = 0.618… (divine proportion)
3. **Archimedean spiral** — r = a + bθ, phase derived from angular proximity
4. **Platonic solid resonance** — 5 Platonic solid symmetry groups, entropy mapped to dihedral angles

The aggregate phase uses a weighted harmonic mean of these four primitives.

References
----------
Euclid. (~300 BCE). *Elements* (trans. Heath, T. L., 1908).
    Cambridge University Press.

Livio, M. (2002). *The Golden Ratio: The Story of Phi, the World's Most
    Astonishing Number*. Broadway Books. ISBN 978-0-7679-0816-0.
"""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter

_PHI: float = 0.618_033_988_749_895
"""Golden ratio φ = (√5-1)/2."""

_PYTHAGOREAN_RATIOS: tuple[float, ...] = (1 / 2, 2 / 3, 3 / 4, 4 / 5, 5 / 6)
"""First five Pythagorean consonant ratios."""

# Platonic solid: {faces, vertices, edges, dihedral_angle_deg}
_PLATONIC_SOLIDS: tuple[tuple[int, int, int, float], ...] = (
    (4, 4, 6, 70.528),  # Tetrahedron
    (6, 8, 12, 90.0),  # Cube (hexahedron)
    (8, 6, 12, 109.471),  # Octahedron
    (12, 20, 30, 116.565),  # Dodecahedron
    (20, 12, 30, 138.190),  # Icosahedron
)


def _pythagorean_resonance(entropy: float) -> float:
    """Proximity of entropy to the nearest Pythagorean consonant ratio.

    Returns a value in [0, 1]; 1.0 = exactly on a ratio.
    """
    min_dist = min(abs(entropy - r) for r in _PYTHAGOREAN_RATIOS)
    # Gaussian proximity kernel, σ = 0.05
    return math.exp(-((min_dist / 0.05) ** 2))


def _golden_section_resonance(entropy: float) -> float:
    """Proximity to φ = 0.618 using a Lorentzian kernel.

    Returns a value in [0, 1]; 1.0 = entropy == φ exactly.
    """
    delta = abs(entropy - _PHI)
    gamma = 0.05  # half-width at half-maximum
    return gamma * gamma / (delta * delta + gamma * gamma)


def _archimedean_phase(entropy: float, phases: int) -> float:
    """Archimedean spiral angular phase resonance.

    Maps entropy + phases to a point on r = φ + φ·θ/2π,
    returns the fractional part of θ/2π as a [0,1] phase.

    Args:
        entropy: Radial coordinate proxy.
        phases: Number of spiral turns.

    Returns:
        Angular phase ∈ [0, 1].
    """
    theta = entropy * 2.0 * math.pi * phases
    r = _PHI + _PHI * theta / (2.0 * math.pi)
    # Phase from fractional spiral position
    frac = r % 1.0
    return frac


def _platonic_resonance(entropy: float) -> float:
    """Resonance with Platonic solid dihedral angles.

    Maps entropy to a dihedral angle [0°, 180°] and returns the
    proximity to the nearest Platonic dihedral angle.

    Returns a value in [0, 1].
    """
    angle_deg = entropy * 180.0
    min_dist = min(abs(angle_deg - solid[3]) for solid in _PLATONIC_SOLIDS)
    # Gaussian proximity, σ = 5 degrees
    return math.exp(-((min_dist / 5.0) ** 2))


class GreekMathAdapter(BaseAdapter):
    """Greek symbolic mathematics resonance adapter — reactivated for v0.3.0.

    Aggregates four classical-mathematics resonance primitives (Pythagorean
    harmony, golden section, Archimedean spiral, Platonic solid symmetry)
    into a weighted harmonic mean CREP phase.

    The adapter provides an *archetype* channel: it resonates strongly when
    the entropy state aligns with deep mathematical harmonics of nature.
    """

    name = "greekmath"
    version = "2.0.0"

    # Primitive weights (must sum to 1 for a proper mean)
    _WEIGHTS: tuple[float, float, float, float] = (0.30, 0.35, 0.20, 0.15)

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        """Compute Greek-mathematics resonance channel data.

        Args:
            entropy: CREP entropy input ∈ [0, 1].
            phases: Phase sample count (used in Archimedean spiral).

        Returns:
            Dict with ``phase``, ``weight``, and individual primitive scores.
        """
        pyth = _pythagorean_resonance(entropy)
        gold = _golden_section_resonance(entropy)
        arch = _archimedean_phase(entropy, phases)
        plat = _platonic_resonance(entropy)

        w = self._WEIGHTS
        phase = w[0] * pyth + w[1] * gold + w[2] * arch + w[3] * plat
        phase = max(0.0, min(1.0, phase))

        return {
            "phase": phase,
            "weight": 1.1,
            "decay": 0.005,
            "pythagorean": pyth,
            "golden_section": gold,
            "archimedean": arch,
            "platonic": plat,
            "phi": _PHI,
        }
