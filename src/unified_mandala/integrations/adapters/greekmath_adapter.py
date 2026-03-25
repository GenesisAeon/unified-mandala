"""GreekMath adapter — symbolic Greek-letter mathematics resonance channel.

Maps the classical Greek symbolic mathematics tradition (Pythagorean harmonics,
Platonic solids, Archimedean spirals, Euclidean geometry) to CREP resonance
phases.  The adapter encodes how deeply a given entropy state resonates with
fundamental mathematical archetypes.

Implemented resonance primitives:

1. **Pythagorean harmony** — Gaussian proximity to the five consonant ratios
   1/2, 2/3, 3/4, 4/5, 5/6:

   .. math::

      \\phi_{\\text{Pyth}}(x) = \\exp\\!\\left[
      -\\left(\\frac{\\min_r |x - r|}{0.05}\\right)^2\\right]

2. **Golden section** — Lorentzian proximity to φ = (√5−1)/2 ≈ 0.618:

   .. math::

      \\phi_{\\text{gold}}(x) = \\frac{\\gamma^2}{(x - \\varphi)^2 + \\gamma^2},
      \\quad \\gamma = 0.05

3. **Logarithmic (equiangular / golden-angle) spiral** — r = exp(bθ) with
   b = ln(Φ)/(π/2); returns the fractional part of r:

   .. math::

      \\theta = 2\\pi n \\cdot x, \\quad r = e^{b\\theta}, \\quad
      \\phi_{\\text{log}}(x) = \\{r\\} \\in [0,1)

4. **Archimedean spiral** — r = φ + φ·θ/(2π), fractional part as phase.

5. **Platonic solid resonance** — Gaussian proximity (σ = 5°) to the five
   Platonic dihedral angles {70.5°, 90°, 109.5°, 116.6°, 138.2°}.

6. **Fibonacci sequence** — Gaussian proximity (σ = 0.03) to fractional
   parts of consecutive Fibonacci ratios F(n+1)/F(n):

   .. math::

      \\phi_{\\text{Fib}}(x) = \\exp\\!\\left[
      -\\left(\\frac{\\min_k |x - F_k|}{0.03}\\right)^2\\right]

Aggregate phase uses weights (0.25, 0.30, 0.15, 0.10, 0.10, 0.10) summing to 1.

References
----------
Euclid. (~300 BCE). *Elements* (trans. Heath, T. L., 1908).
    Cambridge University Press.

Livio, M. (2002). *The Golden Ratio: The Story of Phi, the World's Most
    Astonishing Number*. Broadway Books. ISBN 978-0-7679-0816-0.

Coxeter, H. S. M. (1973). *Regular Polytopes* (3rd ed.).
    Dover Publications. ISBN 978-0-486-61480-9.

Dunlap, R. A. (1997). *The Golden Ratio and Fibonacci Numbers*.
    World Scientific. https://doi.org/10.1142/3595
"""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter

_PHI: float = 0.618_033_988_749_895
"""Golden ratio φ = (√5−1)/2."""

_LOG_PHI_LARGE: float = math.log((math.sqrt(5.0) + 1.0) / 2.0)
"""ln(Φ) = ln((√5+1)/2) ≈ 0.4812 — growth rate of golden equiangular spiral."""

_PYTHAGOREAN_RATIOS: tuple[float, ...] = (1 / 2, 2 / 3, 3 / 4, 4 / 5, 5 / 6)
"""First five Pythagorean consonant ratios."""

# Platonic solid: (faces, vertices, edges, dihedral_angle_deg)
_PLATONIC_SOLIDS: tuple[tuple[int, int, int, float], ...] = (
    (4, 4, 6, 70.528),  # Tetrahedron
    (6, 8, 12, 90.0),  # Cube (hexahedron)
    (8, 6, 12, 109.471),  # Octahedron
    (12, 20, 30, 116.565),  # Dodecahedron
    (20, 12, 30, 138.190),  # Icosahedron
)

# Fibonacci ratios F(n+1)/F(n), fractional parts (converge to φ)
_FIB_SEQUENCE: tuple[int, ...] = (1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233)
_FIB_RATIOS: tuple[float, ...] = tuple(
    (_FIB_SEQUENCE[i + 1] / _FIB_SEQUENCE[i]) % 1.0 for i in range(len(_FIB_SEQUENCE) - 1)
)
"""Fractional parts of F(n+1)/F(n) — converge to φ % 1 = φ ≈ 0.618."""


# ── Resonance primitives ──────────────────────────────────────────────────────


def _pythagorean_resonance(entropy: float) -> float:
    """Proximity of entropy to the nearest Pythagorean consonant ratio.

    Returns a value in [0, 1]; 1.0 = exactly on a ratio.
    """
    min_dist = min(abs(entropy - r) for r in _PYTHAGOREAN_RATIOS)
    return math.exp(-((min_dist / 0.05) ** 2))


def _golden_section_resonance(entropy: float) -> float:
    """Lorentzian proximity to φ = 0.618.

    Returns a value in [0, 1]; 1.0 = entropy == φ exactly.
    """
    delta = abs(entropy - _PHI)
    gamma = 0.05
    return gamma * gamma / (delta * delta + gamma * gamma)


def _logarithmic_spiral_phase(entropy: float, phases: int) -> float:
    """Golden-angle equiangular spiral phase.

    Uses growth rate b = ln(Φ)/(π/2) — the unique spiral whose growth per
    quarter-turn equals the large golden ratio Φ.  Returns the fractional
    part of r = exp(b·θ) as a phase in [0, 1).

    Args:
        entropy: Radial coordinate proxy ∈ [0, 1].
        phases: Spiral turn count (integer ≥ 1).

    Returns:
        Phase ∈ [0, 1).
    """
    b = _LOG_PHI_LARGE / (math.pi / 2.0)
    theta = entropy * 2.0 * math.pi * max(1, phases)
    r = math.exp(b * theta)
    return r % 1.0


def _archimedean_phase(entropy: float, phases: int) -> float:
    """Archimedean spiral angular phase resonance.

    Maps entropy + phases to a point on r = φ + φ·θ/(2π),
    returns the fractional part of r as a [0,1] phase.

    Args:
        entropy: Radial coordinate proxy.
        phases: Number of spiral turns.

    Returns:
        Angular phase ∈ [0, 1].
    """
    theta = entropy * 2.0 * math.pi * phases
    r = _PHI + _PHI * theta / (2.0 * math.pi)
    return r % 1.0


def _platonic_resonance(entropy: float) -> float:
    """Resonance with Platonic solid dihedral angles.

    Maps entropy to a dihedral angle [0°, 180°] and returns Gaussian
    proximity (σ = 5°) to the nearest Platonic dihedral angle.

    Returns a value in [0, 1].
    """
    angle_deg = entropy * 180.0
    min_dist = min(abs(angle_deg - solid[3]) for solid in _PLATONIC_SOLIDS)
    return math.exp(-((min_dist / 5.0) ** 2))


def _fibonacci_resonance(entropy: float) -> float:
    """Gaussian proximity to Fibonacci ratio fractional parts.

    As n→∞, F(n+1)/F(n) → Φ; their fractional parts cluster near φ ≈ 0.618.
    σ = 0.03 gives a sharp proximity kernel.

    Returns a value in [0, 1]; peaks when entropy ≈ φ.
    """
    min_dist = min(abs(entropy - fr) for fr in _FIB_RATIOS)
    return math.exp(-((min_dist / 0.03) ** 2))


class GreekMathAdapter(BaseAdapter):
    """Greek symbolic mathematics resonance adapter — v2.1.0.

    Aggregates six classical-mathematics resonance primitives:

    =========================================  ======
    Primitive                                  Weight
    =========================================  ======
    Pythagorean harmony                        0.25
    Golden section φ                           0.30
    Logarithmic equiangular spiral (NEW)       0.15
    Archimedean spiral                         0.10
    Platonic solid dihedral resonance          0.10
    Fibonacci sequence ratios (NEW)            0.10
    =========================================  ======

    The adapter provides an *archetype* channel: it resonates strongly when
    the entropy state aligns with deep mathematical harmonics of nature.

    New in v2.1.0
    -------------
    * Logarithmic (golden-angle equiangular) spiral primitive
    * Fibonacci ratio proximity primitive
    * Adjusted weights: 6 primitives, sum = 1.0
    * Additional output keys: ``logarithmic``, ``fibonacci``
    """

    name = "greekmath"
    version = "2.1.0"

    _WEIGHTS: tuple[float, float, float, float, float, float] = (
        0.25,  # pythagorean
        0.30,  # golden_section
        0.15,  # logarithmic
        0.10,  # archimedean
        0.10,  # platonic
        0.10,  # fibonacci
    )

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        """Compute Greek-mathematics resonance channel data.

        Args:
            entropy: CREP entropy input ∈ [0, 1].
            phases: Phase sample count (used in spiral primitives).

        Returns:
            Dict with ``phase``, ``weight``, ``decay``, ``pythagorean``,
            ``golden_section``, ``logarithmic``, ``archimedean``,
            ``platonic``, ``fibonacci``, ``phi``.
        """
        pyth = _pythagorean_resonance(entropy)
        gold = _golden_section_resonance(entropy)
        log_s = _logarithmic_spiral_phase(entropy, phases)
        arch = _archimedean_phase(entropy, phases)
        plat = _platonic_resonance(entropy)
        fib = _fibonacci_resonance(entropy)

        w = self._WEIGHTS
        phase = w[0] * pyth + w[1] * gold + w[2] * log_s + w[3] * arch + w[4] * plat + w[5] * fib
        phase = max(0.0, min(1.0, phase))

        return {
            "phase": phase,
            "weight": 1.1,
            "decay": 0.005,
            "pythagorean": pyth,
            "golden_section": gold,
            "logarithmic": log_s,
            "archimedean": arch,
            "platonic": plat,
            "fibonacci": fib,
            "phi": _PHI,
        }
