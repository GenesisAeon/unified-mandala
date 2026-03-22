"""Emergence rate computation.

The emergence rate integrates Shannon entropy over the Sigillin field density:

.. math::

   E(t) = \\frac{d\\Phi}{dt} \\cdot H(S)

where:

* :math:`\\Phi(t) = \\int \\rho(s,t)\\,\\Psi(s)\\,ds` — Sigillin field integral
* :math:`H(S) = -\\sum_i p_i \\log_2 p_i` — Shannon entropy of the system state

A positive :math:`E(t)` indicates constructive emergence;
negative values indicate coherence collapse.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Sequence


@dataclass(frozen=True)
class EmergenceResult:
    """Result of an emergence-rate calculation."""

    rate: float
    """dΦ/dt · H(S), units are [nats·s⁻¹]."""
    entropy: float
    """Shannon entropy H(S) computed over the provided distribution."""
    phi_delta: float
    """Δ of Sigillin field integral between two time points."""
    constructive: bool
    """True when rate > 0."""


class EmergenceRate:
    """Compute emergence rate from Sigillin field snapshots.

    Usage::

        er = EmergenceRate()
        result = er.compute(
            phi_before=0.4, phi_after=0.7,
            delta_t=1.0,
            state_distribution=[0.25, 0.25, 0.25, 0.25],
        )
    """

    @staticmethod
    def shannon_entropy(distribution: Sequence[float]) -> float:
        """Compute Shannon entropy H(S) in bits.

        Args:
            distribution: Probability mass function (need not be normalised).

        Returns:
            H(S) ≥ 0 in bits.
        """
        total = sum(distribution)
        if total <= 0:
            return 0.0
        probs = [p / total for p in distribution if p > 0]
        return -sum(p * math.log2(p) for p in probs)

    def compute(
        self,
        phi_before: float,
        phi_after: float,
        delta_t: float,
        state_distribution: Sequence[float],
    ) -> EmergenceResult:
        """Compute emergence rate E(t).

        Args:
            phi_before: Sigillin field integral Φ at t₀.
            phi_after:  Sigillin field integral Φ at t₁.
            delta_t:    Time elapsed t₁ − t₀ (seconds, must be > 0).
            state_distribution: Discrete probability distribution over
                system microstates used to compute H(S).

        Returns:
            EmergenceResult with rate, entropy, phi_delta, and flag.

        Raises:
            ValueError: If delta_t ≤ 0.
        """
        if delta_t <= 0:
            raise ValueError(f"delta_t must be positive, got {delta_t}")

        phi_delta = phi_after - phi_before
        dphi_dt = phi_delta / delta_t
        entropy = self.shannon_entropy(state_distribution)
        rate = dphi_dt * entropy

        return EmergenceResult(
            rate=rate,
            entropy=entropy,
            phi_delta=phi_delta,
            constructive=rate > 0,
        )
