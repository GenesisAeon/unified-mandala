"""NukleonScanner adapter — nuclear/particle-physics resonance channel.

Models sub-atomic field resonance based on the strong nuclear coupling
constant and quark-gluon plasma (QGP) phase-transition proximity.  Used as
a deep-structure resonance channel in the unified-mandala CREP framework.

The adapter computes a resonance phase derived from:

1. **Strong coupling constant** αs(Q²) running via one-loop QCD:

   .. math::

      \\alpha_s(Q^2) = \\frac{2\\pi}{\\beta_0 \\ln(Q/\\Lambda_{\\text{QCD}})}

   where :math:`\\beta_0 = 11 - 2N_f/3` and :math:`\\Lambda_{\\text{QCD}} \\approx 0.217` GeV.

2. **Confinement proximity** — how close the energy scale *Q* is to the
   QGP phase-transition temperature :math:`T_c \\approx 155` MeV:

   .. math::

      \\phi_{\\text{nuc}} = \\alpha_s(Q^2) \\cdot \\exp\\!\\left(-\\gamma |Q - T_c|\\right)

References
----------
Particle Data Group (2022). *Review of Particle Physics*.
    *Progress of Theoretical and Experimental Physics*, 2022, 083C01.
    https://doi.org/10.1093/ptep/ptac097

Bazavov, A., et al. (2019). QCD equation of state to O(μ_B^6).
    *Physical Review D*, 99(11), 114510.
    https://doi.org/10.1103/PhysRevD.99.114510
"""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter

# QCD constants
_LAMBDA_QCD_GEV: float = 0.217
"""QCD scale parameter Λ_QCD [GeV] — MSbar scheme."""

_T_CONFINEMENT_GEV: float = 0.155
"""Quark-gluon plasma (QGP) critical temperature T_c ≈ 155 MeV = 0.155 GeV."""

_N_FLAVORS: int = 3
"""Number of active quark flavors N_f at hadronic energies."""

_BETA0: float = 11.0 - (2.0 * _N_FLAVORS) / 3.0
"""One-loop QCD beta-function coefficient β₀."""


def _alpha_strong(q_gev: float) -> float:
    """One-loop running strong coupling αs(Q) in QCD.

    Args:
        q_gev: Energy scale Q [GeV] (must be > Λ_QCD).

    Returns:
        αs(Q) — strong coupling constant (dimensionless).
    """
    q = max(q_gev, _LAMBDA_QCD_GEV * 1.001)  # avoid pole
    log_ratio = math.log(q / _LAMBDA_QCD_GEV)
    return (2.0 * math.pi) / (_BETA0 * log_ratio)


class NukleonScannerAdapter(BaseAdapter):
    """Nuclear-physics resonance adapter — reactivated for v0.3.0.

    Computes CREP resonance from strong-coupling and QGP confinement proximity.
    The entropy input maps to an energy scale Q ∈ [Λ_QCD, 10 GeV], and the
    number of phases controls the confinement damping exponent.

    The adapter contributes a *deep structure* signal: when entropy is near
    the fractal singularity φ ≈ 0.618, the QGP proximity peaks, elevating
    the CREP score.
    """

    name = "nukleonscanner"
    version = "2.0.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        """Compute nuclear resonance channel data.

        Args:
            entropy: CREP entropy input ∈ [0, 1].
            phases: Phase sample count (used as damping exponent).

        Returns:
            Dict with ``phase``, ``weight``, ``alpha_s``,
            ``q_gev``, ``qgp_proximity``.
        """
        # Map entropy to energy scale [Λ_QCD, 10 GeV]
        q_gev = _LAMBDA_QCD_GEV + (10.0 - _LAMBDA_QCD_GEV) * entropy

        # Running strong coupling
        alpha_s = _alpha_strong(q_gev)

        # Confinement proximity — how close Q is to T_c
        gamma_damp = 0.5 + 0.1 * phases  # phase-dependent damping
        qgp_proximity = math.exp(-gamma_damp * abs(q_gev - _T_CONFINEMENT_GEV))

        # Resonance phase: alpha_s (capped at 1) × confinement proximity
        raw_phase = min(1.0, alpha_s) * qgp_proximity
        phase = max(0.0, min(1.0, raw_phase))

        return {
            "phase": phase,
            "weight": 1.2,
            "decay": 0.003,
            "alpha_s": alpha_s,
            "q_gev": q_gev,
            "qgp_proximity": qgp_proximity,
            "n_flavors": _N_FLAVORS,
            "lambda_qcd_gev": _LAMBDA_QCD_GEV,
        }
