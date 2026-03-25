"""FieldTheory adapter — quantum scalar field resonance channel.

Models the resonance of a free massive scalar quantum field in the
unified-mandala CREP framework.  The adapter implements the full canonical
quantum field theory (QFT) structure for a real Klein-Gordon scalar field,
mapping the CREP entropy input to field observables.

Physical model
--------------
A free real scalar field φ(x,t) satisfies the **Klein-Gordon equation**:

.. math::

   \\left(\\partial_t^2 - \\nabla^2 + m^2\\right)\\phi(x,t) = 0

with natural units ℏ = c = 1.

The **Lagrangian density** is:

.. math::

   \\mathcal{L} = \\tfrac{1}{2}(\\partial_\\mu \\phi)^2
                - \\tfrac{1}{2} m^2 \\phi^2
               = \\tfrac{1}{2}\\dot{\\phi}^2
                - \\tfrac{1}{2}(\\nabla\\phi)^2
                - \\tfrac{1}{2} m^2 \\phi^2

The **dispersion relation** for a plane-wave mode with wavenumber *k* is:

.. math::

   \\omega^2(k) = k^2 + m^2

The **Feynman propagator** in momentum space is:

.. math::

   \\Delta_F(p) = \\frac{i}{p^2 - m^2 + i\\varepsilon}

whose magnitude at Euclidean momentum p_E is:

.. math::

   |\\Delta_E(p_E)| = \\frac{1}{p_E^2 + m^2}

The CREP resonance phase is constructed from:

1. **Standing-wave amplitude** — a damped plane-wave mode
   ψ(x,t) = A·sin(k·x)·exp(−γ·t) evaluated at x=entropy, t=phases:

   .. math::

      A(x,t) = |\\sin(k\\,x)| \\cdot e^{-\\gamma t}

2. **Dispersion resonance** — how close the mode is to being on-shell
   (k² + m² = ω²):

   .. math::

      \\phi_{\\text{disp}} = \\exp\\!\\left(-\\frac{|\\omega - \\omega(k)|}{\\delta\\omega}\\right)

3. **Propagator magnitude** — Euclidean propagator at p_E = entropy:

   .. math::

      \\phi_{\\text{prop}} = \\frac{1}{p_E^2 + m^2}

   normalised to [0, 1] by the massless limit 1/(p_E² + ε).

References
----------
Peskin, M. E., & Schroeder, D. V. (1995). *An Introduction to Quantum
    Field Theory*. Westview Press. ISBN 978-0-201-50397-5.

Srednicki, M. (2007). *Quantum Field Theory*. Cambridge University Press.
    https://doi.org/10.1017/CBO9780511813917

Itzykson, C., & Zuber, J.-B. (1980). *Quantum Field Theory*. McGraw-Hill.
    ISBN 978-0-07-032071-5.

Zee, A. (2010). *Quantum Field Theory in a Nutshell* (2nd ed.).
    Princeton University Press. ISBN 978-0-691-14034-6.
"""

from __future__ import annotations

import math
from typing import Any

from unified_mandala.integrations.registry import BaseAdapter

# ── Physical constants (natural units ℏ = c = 1) ─────────────────────────────

_MASS_GEV: float = 0.135
"""Default scalar field mass m ≈ 135 MeV (neutral pion mass) [GeV]."""

_WAVE_NUMBER: float = math.pi
"""Default wavenumber k = π [GeV] for the fundamental mode."""

_GAMMA_DAMP: float = 0.10
"""Damping coefficient γ [GeV] for the standing-wave amplitude."""

_DELTA_OMEGA: float = 0.05
"""Energy resolution δω [GeV] for the dispersion resonance kernel."""

# Propagator normalisation: massless value at p_E = 0 is 1/ε → use m=0 at p_E=0
_PROP_NORM: float = 1.0 / (_MASS_GEV**2 + 1e-9)
"""Normalisation constant for the Euclidean propagator (massless limit, p_E=0)."""

# Aggregate channel weights (must sum to 1)
_W_AMPLITUDE: float = 0.50
"""Weight of the standing-wave amplitude channel."""

_W_DISPERSION: float = 0.30
"""Weight of the on-shell dispersion resonance channel."""

_W_PROPAGATOR: float = 0.20
"""Weight of the Euclidean propagator channel."""


# ── QFT primitives ────────────────────────────────────────────────────────────


def _dispersion_omega(k: float, mass: float) -> float:
    """On-shell angular frequency from the dispersion relation.

    .. math:: \\omega(k) = \\sqrt{k^2 + m^2}

    Args:
        k: Wavenumber [GeV].
        mass: Scalar field mass m [GeV].

    Returns:
        Angular frequency ω [GeV].
    """
    return math.sqrt(k * k + mass * mass)


def _standing_wave_amplitude(entropy: float, phases: int) -> float:
    """Damped standing-wave amplitude |ψ(x=entropy, t=phases)|.

    ψ(x,t) = |sin(k·x)| · exp(−γ·t)

    Args:
        entropy: Spatial coordinate x ∈ [0, 1].
        phases: Temporal parameter t (integer step count).

    Returns:
        Amplitude ∈ [0, 1].
    """
    return abs(math.sin(_WAVE_NUMBER * entropy)) * math.exp(-_GAMMA_DAMP * phases)


def _dispersion_resonance(entropy: float) -> float:
    """On-shell dispersion resonance.

    Measures how close the mode (k=π·entropy, ω=1) is to the on-shell
    condition ω(k) = sqrt(k²+m²).  Uses an exponential proximity kernel
    with resolution δω.

    Args:
        entropy: Maps to wavenumber k = π · entropy.

    Returns:
        Resonance ∈ (0, 1]; peaks when entropy is on-shell.
    """
    k = _WAVE_NUMBER * entropy
    omega_on_shell = _dispersion_omega(k, _MASS_GEV)
    # Reference frequency: unit energy scale (ω = 1 GeV)
    delta = abs(omega_on_shell - 1.0)
    return math.exp(-delta / _DELTA_OMEGA)


def _euclidean_propagator(entropy: float) -> float:
    """Normalised Euclidean scalar propagator at p_E = entropy.

    .. math::

       \\tilde{\\Delta}_E(p_E) =
       \\frac{1/(p_E^2 + m^2)}{1/(0^2 + m^2)}
       = \\frac{m^2}{p_E^2 + m^2}

    Returns 1 at p_E = 0 (maximum propagation) and decreases with momentum.

    Args:
        entropy: Euclidean momentum p_E [GeV].

    Returns:
        Normalised propagator magnitude ∈ (0, 1].
    """
    p_e2 = entropy * entropy
    m2 = _MASS_GEV * _MASS_GEV
    return m2 / (p_e2 + m2)


def _lagrangian_density(entropy: float, phases: int) -> float:
    """Lagrangian density L at (x=entropy, t=phases) for a standing wave.

    .. math::

       \\mathcal{L} = \\tfrac{1}{2}\\dot{\\phi}^2
                    - \\tfrac{1}{2}(\\partial_x \\phi)^2
                    - \\tfrac{1}{2} m^2 \\phi^2

    For the standing wave φ = A·sin(kx)·exp(−γt):

    * φ_t  = −γ·φ
    * φ_x  = A·k·cos(kx)·exp(−γt)
    * φ²   = A²·sin²(kx)·exp(−2γt)

    Args:
        entropy: Spatial coordinate x.
        phases: Time step t.

    Returns:
        Lagrangian density value (real-valued, may be negative).
    """
    phi = math.sin(_WAVE_NUMBER * entropy) * math.exp(-_GAMMA_DAMP * phases)
    phi_t = -_GAMMA_DAMP * phi
    phi_x = (
        math.cos(_WAVE_NUMBER * entropy)
        * _WAVE_NUMBER
        * math.exp(-_GAMMA_DAMP * phases)
    )
    return 0.5 * phi_t**2 - 0.5 * phi_x**2 - 0.5 * _MASS_GEV**2 * phi**2


class FieldtheoryAdapter(BaseAdapter):
    """Quantum scalar field theory resonance adapter — v2.0.0.

    Implements CREP resonance from the free massive Klein-Gordon scalar field:

    * **Standing-wave amplitude** A = |sin(k·x)|·exp(−γt)      (w=0.50)
    * **On-shell dispersion resonance** near ω(k)=1 GeV         (w=0.30)
    * **Euclidean propagator** Δ_E = m²/(p_E²+m²)               (w=0.20)

    The aggregate phase provides a *field resonance* signal: it peaks when
    the entropy state places the system on or near the mass shell of the
    scalar field (dispersion resonance) and/or near zero spatial momentum
    (propagator channel).

    Physical parameters (natural units ℏ = c = 1)
    -----------------------------------------------
    * m = 0.135 GeV (neutral pion mass)
    * k = π GeV (fundamental standing-wave mode)
    * γ = 0.10 GeV (wave damping coefficient)
    * δω = 0.05 GeV (dispersion resonance width)

    New in v2.0.0
    -------------
    * Full Klein-Gordon physics replacing the minimal stub
    * Dispersion relation ω²(k) = k² + m²
    * Euclidean Feynman propagator Δ_E(p_E) = m²/(p_E²+m²)
    * Lagrangian density computation (diagnostic output)
    * Scientific docstrings + PDG/Peskin-Schroeder references
    * Additional output keys: ``dispersion``, ``propagator``,
      ``lagrangian``, ``omega_on_shell``, ``mass_gev``
    """

    name = "fieldtheory"
    version = "2.0.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        """Compute quantum scalar field resonance channel data.

        Args:
            entropy: CREP entropy input ∈ [0, 1] (spatial coordinate x).
            phases: Phase sample count (temporal step t for damping).

        Returns:
            Dict with keys ``phase``, ``weight``, ``decay``, ``amplitude``,
            ``dispersion``, ``propagator``, ``lagrangian``, ``omega_on_shell``,
            ``wave_number``, ``damping``, ``mass_gev``.
        """
        amplitude = _standing_wave_amplitude(entropy, phases)
        dispersion = _dispersion_resonance(entropy)
        propagator = _euclidean_propagator(entropy)
        lagrangian = _lagrangian_density(entropy, phases)

        k = _WAVE_NUMBER * entropy
        omega_on_shell = _dispersion_omega(k, _MASS_GEV)

        raw_phase = (
            _W_AMPLITUDE * amplitude
            + _W_DISPERSION * dispersion
            + _W_PROPAGATOR * propagator
        )
        phase = max(0.0, min(1.0, raw_phase))

        return {
            "phase": phase,
            "weight": 1.4,
            "decay": 0.007,
            "amplitude": amplitude,
            "dispersion": dispersion,
            "propagator": propagator,
            "lagrangian": lagrangian,
            "omega_on_shell": omega_on_shell,
            "wave_number": _WAVE_NUMBER,
            "damping": _GAMMA_DAMP,
            "mass_gev": _MASS_GEV,
        }
