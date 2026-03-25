"""NukleonScanner adapter — nuclear/particle-physics resonance channel.

Models sub-atomic field resonance based on the strong nuclear coupling
constant and quark-gluon plasma (QGP) phase-transition proximity.  Used as
a deep-structure resonance channel in the unified-mandala CREP framework.

The adapter computes a resonance phase derived from:

1. **Two-loop running strong coupling** αs(Q) in QCD:

   .. math::

      \\alpha_s(Q) = \\frac{2\\pi}{\\beta_0 \\ln(Q/\\Lambda_{\\text{QCD}})}
      \\left[1 - \\frac{\\beta_1 \\ln\\!\\ln(Q/\\Lambda_{\\text{QCD}})}{
      \\beta_0^2 \\ln(Q/\\Lambda_{\\text{QCD}})}\\right]

   where :math:`\\beta_0 = 11 - 2N_f/3`,
   :math:`\\beta_1 = 102 - 38N_f/3`, and
   :math:`\\Lambda_{\\text{QCD}} \\approx 0.217` GeV (MSbar scheme).

2. **Confinement string tension** — QCD flux-tube energy per unit length
   :math:`\\sigma_{\\text{string}} \\approx 0.18 \\text{ GeV}^2`, entering via:

   .. math::

      \\phi_{\\text{string}}(Q) = \\exp\\!\\left(-\\sigma_{\\text{string}} / Q^2\\right)

3. **QGP crossover proximity** — how close the energy scale *Q* is to the
   pseudo-critical temperature :math:`T_c \\approx 155` MeV:

   .. math::

      \\phi_{\\text{QGP}}(Q) = \\exp\\!\\left(-\\gamma |Q - T_c|\\right)

4. **Aggregate resonance phase** — weighted combination:

   .. math::

      \\phi = w_1 \\min(\\alpha_s, 1) \\cdot \\phi_{\\text{QGP}}
             + w_2 \\,\\phi_{\\text{string}}

References
----------
Particle Data Group (2022). *Review of Particle Physics*.
    *Progress of Theoretical and Experimental Physics*, 2022, 083C01.
    https://doi.org/10.1093/ptep/ptac097

Bazavov, A., et al. (2019). QCD equation of state to O(μ_B^6) from
    lattice QCD. *Physical Review D*, 99(11), 114510.
    https://doi.org/10.1103/PhysRevD.99.114510

Boucaud, P., et al. (2012). The strong coupling constant at small Q²
    from lattice QCD. *Few-Body Systems*, 53(3–4), 387–395.
    https://doi.org/10.1007/s00601-011-0301-2
"""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter

# ── QCD constants ─────────────────────────────────────────────────────────────

_LAMBDA_QCD_GEV: float = 0.217
"""QCD scale parameter Λ_QCD [GeV] — MSbar scheme."""

_T_CONFINEMENT_GEV: float = 0.155
"""QGP pseudo-critical temperature T_c ≈ 155 MeV = 0.155 GeV."""

_N_FLAVORS: int = 3
"""Number of active quark flavors N_f at hadronic energies."""

_BETA0: float = 11.0 - (2.0 * _N_FLAVORS) / 3.0
"""One-loop QCD beta-function coefficient β₀ = 11 − 2N_f/3."""

_BETA1: float = 102.0 - (38.0 * _N_FLAVORS) / 3.0
"""Two-loop QCD beta-function coefficient β₁ = 102 − 38N_f/3."""

_SIGMA_STRING_GEV2: float = 0.18
"""QCD string tension σ_string ≈ 0.18 GeV² (from Regge slope α' ≈ 0.9 GeV⁻²)."""

_W_QGP: float = 0.70
"""Weight of the QGP-proximity × αs channel."""

_W_STRING: float = 0.30
"""Weight of the string-tension confinement channel."""


# ── Physics primitives ────────────────────────────────────────────────────────


def _alpha_strong(q_gev: float) -> float:
    """Two-loop running strong coupling αs(Q) in QCD.

    Includes the leading logarithmic two-loop correction, giving improved
    accuracy in the range 1 GeV ≤ Q ≤ 100 GeV relative to the one-loop result.

    Args:
        q_gev: Energy scale Q [GeV]. Clamped above the Landau pole.

    Returns:
        αs(Q) ≥ 0 — dimensionless strong coupling constant.
    """
    q = max(q_gev, _LAMBDA_QCD_GEV * 1.001)
    t = math.log(q / _LAMBDA_QCD_GEV)
    one_loop = (2.0 * math.pi) / (_BETA0 * t)
    # Two-loop correction: −β₁ ln(t) / (β₀² · t)
    two_loop_corr = -(_BETA1 * math.log(max(t, 1e-12))) / (_BETA0**2 * t) if t > 0 else 0.0
    return max(0.0, one_loop * (1.0 + two_loop_corr))


def _string_tension_phase(q_gev: float) -> float:
    """QCD string-tension confinement phase.

    φ_string(Q) = exp(−σ_string / Q²).
    Approaches 1 at high Q (asymptotic freedom / deconfinement) and 0 at
    low Q (full confinement), modelling the flux-tube breaking at the
    Hagedorn temperature.

    Args:
        q_gev: Energy scale Q [GeV].

    Returns:
        Confinement phase ∈ [0, 1].
    """
    q2 = max(q_gev * q_gev, 1e-9)
    return math.exp(-_SIGMA_STRING_GEV2 / q2)


def _qgp_proximity(q_gev: float, gamma_damp: float) -> float:
    """QGP crossover proximity at energy scale Q.

    Exponential proximity to T_c ≈ 155 MeV.

    Args:
        q_gev: Energy scale Q [GeV].
        gamma_damp: Damping coefficient (phase-count dependent).

    Returns:
        Proximity ∈ (0, 1]; peaks at Q = T_c.
    """
    return math.exp(-gamma_damp * abs(q_gev - _T_CONFINEMENT_GEV))


class NukleonScannerAdapter(BaseAdapter):
    """Nuclear-physics resonance adapter — v2.1.0.

    Computes CREP resonance from:

    * Two-loop QCD running coupling αs(Q)
    * QGP crossover proximity φ_QGP
    * String-tension confinement phase φ_string

    Entropy maps to an energy scale Q ∈ [Λ_QCD, 10 GeV].  The number of
    phases controls the QGP-proximity damping exponent γ.  The adapter
    contributes a *deep structure* signal: when entropy aligns with the
    fractal singularity φ ≈ 0.618, QGP proximity peaks.

    New in v2.1.0
    -------------
    * Two-loop αs(Q) correction (β₁ term) for improved high-Q accuracy
    * String-tension channel φ_string = exp(−σ/Q²) — models flux-tube breaking
    * Weighted combination: phase = 0.70 · αs · φ_QGP + 0.30 · φ_string
    * Additional output keys: ``string_phase``, ``sigma_string_gev2``
    """

    name = "nukleonscanner"
    version = "2.1.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        """Compute nuclear resonance channel data.

        Args:
            entropy: CREP entropy input ∈ [0, 1].
            phases: Phase sample count (controls QGP damping exponent γ).

        Returns:
            Dict with keys ``phase``, ``weight``, ``decay``, ``alpha_s``,
            ``q_gev``, ``qgp_proximity``, ``string_phase``, ``n_flavors``,
            ``lambda_qcd_gev``, ``sigma_string_gev2``.
        """
        # Map entropy to energy scale [Λ_QCD, 10 GeV]
        q_gev = _LAMBDA_QCD_GEV + (10.0 - _LAMBDA_QCD_GEV) * entropy

        alpha_s = _alpha_strong(q_gev)

        gamma_damp = 0.5 + 0.1 * phases
        qgp_prox = _qgp_proximity(q_gev, gamma_damp)
        str_phase = _string_tension_phase(q_gev)

        qgp_channel = min(1.0, alpha_s) * qgp_prox
        raw_phase = _W_QGP * qgp_channel + _W_STRING * str_phase
        phase = max(0.0, min(1.0, raw_phase))

        return {
            "phase": phase,
            "weight": 1.2,
            "decay": 0.003,
            "alpha_s": alpha_s,
            "q_gev": q_gev,
            "qgp_proximity": qgp_prox,
            "string_phase": str_phase,
            "n_flavors": _N_FLAVORS,
            "lambda_qcd_gev": _LAMBDA_QCD_GEV,
            "sigma_string_gev2": _SIGMA_STRING_GEV2,
        }
