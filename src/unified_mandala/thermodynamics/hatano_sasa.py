"""Hatano-Sasa entropy production for driven non-equilibrium systems.

For a Langevin system whose stationary distribution :math:`p_{ss}(x, \\lambda)`
depends on an external protocol :math:`\\lambda(t)`, the Hatano-Sasa relation
decomposes total entropy production into *housekeeping* (steady-state
maintenance) and *excess* (transient reorganisation) parts:

.. math::

   \\sigma_{\\text{tot}} = \\sigma_{\\text{hk}} + \\sigma_{\\text{ex}}

The **excess** (Hatano-Sasa) entropy production is:

.. math::

   \\Sigma_{\\text{ex}} = -\\int_0^\\tau \\dot{\\lambda}(t)\\,
   \\partial_\\lambda \\ln p_{ss}(x(t), \\lambda(t))\\,dt

It satisfies the integral fluctuation theorem:

.. math::

   \\langle e^{-\\Sigma_{\\text{ex}}} \\rangle = 1

References
----------
Hatano, T., & Sasa, S. (2001). Steady-state thermodynamics of Langevin systems.
    *Physical Review Letters*, 86(16), 3463–3466.
    https://doi.org/10.1103/PhysRevLett.86.3463

Speck, T., & Seifert, U. (2005). Integral fluctuation theorem for the housekeeping heat.
    *Journal of Physics A*, 38(34), L581–L588.
    https://doi.org/10.1088/0305-4470/38/34/L03
"""

from __future__ import annotations

import math
from collections.abc import Callable, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class TrajectorySegment:
    """One time-step segment of a driven trajectory.

    Attributes:
        x: State at time t.
        lam: Protocol value λ at time t.
        lam_dot: Protocol rate dλ/dt at time t.
        d_ln_pss_dlam: ∂/∂λ ln p_ss(x, λ) at this state/protocol.
        dt: Time-step duration [s].
    """

    x: float
    lam: float
    lam_dot: float
    d_ln_pss_dlam: float
    dt: float


def hatano_sasa_excess(segments: Sequence[TrajectorySegment]) -> float:
    """Discrete Hatano-Sasa excess entropy production along a trajectory.

    Numerical integration using the trapezoidal rule over segments:

    .. math::

       \\Sigma_{\\text{ex}} \\approx -\\sum_i
       \\dot{\\lambda}_i \\cdot \\partial_\\lambda \\ln p_{ss}(x_i, \\lambda_i)
       \\cdot \\Delta t_i

    Args:
        segments: Ordered sequence of trajectory segments.

    Returns:
        Excess entropy production Σ_ex (dimensionless, in units of k_B).
    """
    sigma: float = 0.0
    for seg in segments:
        sigma -= seg.lam_dot * seg.d_ln_pss_dlam * seg.dt
    return sigma


def integral_fluctuation_check(sigma_ex_values: Sequence[float], atol: float = 0.1) -> bool:
    """Check the integral fluctuation theorem ⟨exp(-Σ_ex)⟩ ≈ 1.

    For an ensemble of independent trajectories the mean of exp(-Σ_ex)
    should converge to 1 in the long-time limit.

    Args:
        sigma_ex_values: Σ_ex for each independent trajectory.
        atol: Absolute tolerance for deviation from 1.0 (default 0.1).

    Returns:
        True when |⟨exp(-Σ_ex)⟩ - 1| ≤ atol.

    Raises:
        ValueError: If sigma_ex_values is empty.
    """
    if not sigma_ex_values:
        raise ValueError("sigma_ex_values must not be empty.")
    n = len(sigma_ex_values)
    mean_exp = sum(math.exp(-s) for s in sigma_ex_values) / n
    return abs(mean_exp - 1.0) <= atol


@dataclass(frozen=True)
class HatanoSasaProduction:
    """Result of a Hatano-Sasa entropy production evaluation.

    Attributes:
        sigma_ex: Excess entropy production [k_B units].
        sigma_hk: Housekeeping entropy production [k_B units] (if provided).
        sigma_tot: Total entropy production = sigma_hk + sigma_ex.
        ift_value: ⟨exp(-Σ_ex)⟩ value (None if single trajectory).
    """

    sigma_ex: float
    sigma_hk: float = 0.0
    ift_value: float | None = None

    @property
    def sigma_tot(self) -> float:
        """Total entropy production σ_tot = σ_hk + σ_ex."""
        return self.sigma_hk + self.sigma_ex

    @property
    def second_law_satisfied(self) -> bool:
        """True when σ_tot ≥ 0 (second law)."""
        return self.sigma_tot >= 0.0

    @classmethod
    def from_segments(
        cls,
        segments: Sequence[TrajectorySegment],
        sigma_hk: float = 0.0,
    ) -> "HatanoSasaProduction":
        """Compute Hatano-Sasa production from trajectory segments.

        Args:
            segments: Trajectory segments for numerical integration.
            sigma_hk: Pre-computed housekeeping contribution (default 0).

        Returns:
            HatanoSasaProduction instance.
        """
        sigma_ex = hatano_sasa_excess(segments)
        return cls(sigma_ex=sigma_ex, sigma_hk=sigma_hk)

    @classmethod
    def from_gaussian_process(
        cls,
        n_steps: int,
        drift_fn: Callable[[float], float],
        diffusion: float,
        dt: float,
        sigma_hk: float = 0.0,
        *,
        seed: int = 42,
    ) -> "HatanoSasaProduction":
        """Simulate a simple Langevin process and compute Σ_ex numerically.

        Uses the Euler-Maruyama scheme with a constant-diffusion SDE:
        dx = drift(x) dt + diffusion dW

        The steady-state log-gradient is approximated as
        ∂_λ ln p_ss ≈ -drift(x) / diffusion² (Ornstein-Uhlenbeck proxy).

        Args:
            n_steps: Number of time steps.
            drift_fn: Deterministic drift f(x).
            diffusion: Noise amplitude σ.
            dt: Time step [s].
            sigma_hk: Housekeeping contribution.
            seed: RNG seed for reproducibility.

        Returns:
            HatanoSasaProduction instance.
        """
        import random

        rng = random.Random(seed)
        x = 0.0
        sigma_ex = 0.0
        d2 = diffusion * diffusion

        for _ in range(n_steps):
            f = drift_fn(x)
            # ∂_λ ln p_ss proxy for OU process: -f/D
            d_ln_pss = -f / d2 if d2 > 0 else 0.0
            lam_dot = f  # protocol rate approximated by drift
            sigma_ex -= lam_dot * d_ln_pss * dt
            dW = rng.gauss(0.0, math.sqrt(dt))
            x = x + f * dt + diffusion * dW

        return cls(sigma_ex=sigma_ex, sigma_hk=sigma_hk)
