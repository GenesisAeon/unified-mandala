"""Collapse detector — SDE-based systemic-collapse model.

Models the onset of systemic collapse using a stochastic differential
equation (SDE) whose deterministic skeleton encodes:

1. **Tainter complexity dynamics** — complexity C grows but yields
   diminishing marginal returns; above a critical threshold the maintenance
   cost exceeds productivity, driving collapse.
2. **Prigogine dissipative structure bifurcation** — the system can
   self-organise into a new dissipative structure *before* collapse if
   the non-equilibrium driving exceeds a bifurcation point.
3. **Fractal singularity at φ = 0.618** — the golden-ratio entropy value
   acts as a separatrix between the collapse basin and the emergence basin.

The SDE (Itô form):

.. math::

   dX = f(X, \\lambda)\\,dt + \\sigma(X)\\,dW_t

where:

.. math::

   f(X, \\lambda) = \\lambda X (1 - X)(X - \\phi_c) - \\gamma X^2

* :math:`X \\in [0, 1]` — normalised systemic tension (0 = stable, 1 = collapse)
* :math:`\\lambda` — Tainter driving coefficient (= complexity / capacity)
* :math:`\\phi_c = 0.618` — fractal singularity (golden ratio)
* :math:`\\gamma` — Prigogine dissipation rate (self-organisation damping)
* :math:`\\sigma(X) = \\sigma_0 \\sqrt{X(1-X)}` — state-dependent noise

Numerical integration uses the **Euler-Maruyama** scheme.

References
----------
Tainter, J. A. (1988). *The Collapse of Complex Societies*.
    Cambridge University Press. ISBN 978-0-521-38673-9.

Prigogine, I., & Stengers, I. (1984). *Order Out of Chaos*.
    Bantam Books. ISBN 0-553-34082-4.

Kloeden, P. E., & Platen, E. (1992). *Numerical Solution of Stochastic
    Differential Equations*. Springer. https://doi.org/10.1007/978-3-662-12616-5
"""

from __future__ import annotations

import math
import random
from collections.abc import Sequence
from dataclasses import dataclass, field

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

FRACTAL_SINGULARITY: float = 0.618_033_988_749_895
"""Golden-ratio separatrix φ_c between collapse and emergence basins."""

COLLAPSE_THRESHOLD: float = 0.85
"""X ≥ COLLAPSE_THRESHOLD → imminent collapse."""

EMERGENCE_BASIN_UPPER: float = FRACTAL_SINGULARITY
"""X < FRACTAL_SINGULARITY → system in emergence basin (away from collapse)."""


# ---------------------------------------------------------------------------
# Trajectory
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class CollapseTrajectory:
    """Result of a full SDE simulation run.

    Attributes:
        times: Sequence of time points [s].
        states: Systemic tension X at each time point.
        collapsed: True if X crossed COLLAPSE_THRESHOLD.
        emergence_triggered: True if X dipped below FRACTAL_SINGULARITY
            after rising above it (bifurcation into new structure).
        collapse_time: Time at which collapse threshold was first crossed
            (None if no collapse).
        systemic_tension_peak: Maximum X observed.
        final_state: X at the last time point.
        prigogine_events: Number of Prigogine bifurcation crossings.
    """

    times: tuple[float, ...]
    states: tuple[float, ...]
    collapsed: bool
    emergence_triggered: bool
    collapse_time: float | None
    systemic_tension_peak: float
    final_state: float
    prigogine_events: int

    @property
    def mean_tension(self) -> float:
        """Time-averaged systemic tension ⟨X⟩."""
        if not self.states:
            return 0.0
        return sum(self.states) / len(self.states)

    @property
    def variance_tension(self) -> float:
        """Variance of systemic tension Var(X)."""
        if len(self.states) < 2:
            return 0.0
        mu = self.mean_tension
        return sum((x - mu) ** 2 for x in self.states) / len(self.states)

    @property
    def tainter_index(self) -> float:
        """Tainter collapse index: mean_tension / (1 - systemic_tension_peak + 1e-9).

        Values > 1.0 indicate pre-collapse complexity overload.
        """
        return self.mean_tension / (1.0 - self.systemic_tension_peak + 1e-9)

    @property
    def n_steps(self) -> int:
        """Number of simulation steps."""
        return len(self.states)


# ---------------------------------------------------------------------------
# Collapse Detector
# ---------------------------------------------------------------------------


@dataclass
class CollapseDetectorConfig:
    """Configuration for the SDE collapse detector.

    Attributes:
        tainter_lambda: Tainter driving coefficient λ ∈ [0, ∞).
        prigogine_gamma: Prigogine dissipation rate γ ≥ 0.
        noise_sigma: SDE noise amplitude σ₀ ≥ 0.
        dt: Time step [s].
        t_max: Simulation horizon [s].
        x0: Initial systemic tension X(0) ∈ [0, 1].
        seed: RNG seed for reproducibility (None = non-deterministic).
    """

    tainter_lambda: float = 2.5
    prigogine_gamma: float = 0.4
    noise_sigma: float = 0.05
    dt: float = 0.01
    t_max: float = 10.0
    x0: float = 0.1
    seed: int | None = 42


class CollapseDetector:
    """SDE-based systemic collapse detector using Euler-Maruyama integration.

    Simulates Tainter-Prigogine complexity dynamics with a fractal
    singularity at φ = 0.618.

    Example::

        detector = CollapseDetector()
        traj = detector.simulate()
        print(f"Collapsed: {traj.collapsed}")
        print(f"Peak tension: {traj.systemic_tension_peak:.3f}")
        risk = detector.collapse_risk(traj)
        print(f"Collapse risk score: {risk:.3f}")
    """

    def __init__(self, config: CollapseDetectorConfig | None = None) -> None:
        self.config = config or CollapseDetectorConfig()

    # ------------------------------------------------------------------
    # Drift and diffusion
    # ------------------------------------------------------------------

    def drift(self, x: float, lam: float | None = None) -> float:
        """Deterministic drift f(X, λ).

        .. math::

           f(X, \\lambda) = \\lambda X (1-X)(X - \\phi_c) - \\gamma X^2

        Args:
            x: Current state X ∈ [0, 1].
            lam: Override λ (uses config if None).

        Returns:
            Drift value f(X, λ).
        """
        lam = lam if lam is not None else self.config.tainter_lambda
        gamma = self.config.prigogine_gamma
        phi_c = FRACTAL_SINGULARITY
        tainter_term = lam * x * (1.0 - x) * (x - phi_c)
        prigogine_term = gamma * x * x
        return tainter_term - prigogine_term

    def diffusion(self, x: float) -> float:
        """State-dependent diffusion σ(X).

        .. math::

           \\sigma(X) = \\sigma_0 \\sqrt{X(1-X)}

        Args:
            x: Current state X ∈ [0, 1] (clamped internally).

        Returns:
            Noise amplitude ≥ 0.
        """
        x_c = max(0.0, min(1.0, x))
        return self.config.noise_sigma * math.sqrt(x_c * (1.0 - x_c))

    # ------------------------------------------------------------------
    # Euler-Maruyama integration
    # ------------------------------------------------------------------

    def simulate(self, x0: float | None = None) -> CollapseTrajectory:
        """Run the SDE simulation using Euler-Maruyama.

        .. math::

           X_{n+1} = X_n + f(X_n)\\,\\Delta t
                     + \\sigma(X_n)\\,\\sqrt{\\Delta t}\\,Z_n

        where :math:`Z_n \\sim \\mathcal{N}(0,1)`.

        Args:
            x0: Initial state (overrides config if given).

        Returns:
            CollapseTrajectory with full simulation record.
        """
        cfg = self.config
        rng = random.Random(cfg.seed)
        dt = cfg.dt
        sqrt_dt = math.sqrt(dt)
        n_steps = int(cfg.t_max / dt)

        x = x0 if x0 is not None else cfg.x0
        x = max(0.0, min(1.0, x))

        times: list[float] = []
        states: list[float] = []
        collapsed = False
        collapse_time: float | None = None
        peak_x = x
        prigogine_events = 0
        emergence_triggered = False
        above_singularity = x >= FRACTAL_SINGULARITY

        for step in range(n_steps):
            t = step * dt
            times.append(t)
            states.append(x)

            if x > peak_x:
                peak_x = x

            # Track Prigogine bifurcation crossings (up → down across φ_c)
            now_above = x >= FRACTAL_SINGULARITY
            if above_singularity and not now_above:
                prigogine_events += 1
                emergence_triggered = True
            above_singularity = now_above

            # Check collapse
            if not collapsed and x >= COLLAPSE_THRESHOLD:
                collapsed = True
                collapse_time = t

            # Euler-Maruyama step
            f = self.drift(x)
            sigma = self.diffusion(x)
            dW = rng.gauss(0.0, sqrt_dt)
            x = x + f * dt + sigma * dW
            x = max(0.0, min(1.0, x))  # keep in [0, 1]

        return CollapseTrajectory(
            times=tuple(times),
            states=tuple(states),
            collapsed=collapsed,
            emergence_triggered=emergence_triggered,
            collapse_time=collapse_time,
            systemic_tension_peak=peak_x,
            final_state=x,
            prigogine_events=prigogine_events,
        )

    # ------------------------------------------------------------------
    # Risk scoring
    # ------------------------------------------------------------------

    def collapse_risk(self, traj: CollapseTrajectory) -> float:
        """Aggregate collapse risk score R ∈ [0, 1].

        Combines:
        - Mean systemic tension (50 % weight)
        - Proximity to COLLAPSE_THRESHOLD from peak (30 % weight)
        - Variance (20 % weight)

        Args:
            traj: Simulation trajectory.

        Returns:
            Scalar risk score R ∈ [0, 1].
        """
        mean_w = 0.5
        peak_w = 0.3
        var_w = 0.2

        mean_score = traj.mean_tension
        peak_score = min(1.0, traj.systemic_tension_peak / COLLAPSE_THRESHOLD)
        var_score = min(1.0, math.sqrt(traj.variance_tension) * 5.0)

        return min(1.0, mean_w * mean_score + peak_w * peak_score + var_w * var_score)

    def systemic_tension_from_crep(self, crep_score: float, entropy: float) -> float:
        """Map CREP score and entropy to initial systemic tension X₀.

        High entropy + low CREP → high tension (near-collapse).
        Low entropy + high CREP → low tension (stable emergence).

        .. math::

           X_0 = \\frac{H + (1 - C)}{2}

        Args:
            crep_score: CREP score C ∈ [0, 1].
            entropy: Normalised entropy H ∈ [0, 1].

        Returns:
            Initial tension X₀ ∈ [0, 1].
        """
        return (entropy + (1.0 - crep_score)) / 2.0

    # ------------------------------------------------------------------
    # Batch analysis
    # ------------------------------------------------------------------

    def monte_carlo(
        self,
        n_runs: int,
        x0_values: Sequence[float] | None = None,
    ) -> "MonteCarloResult":
        """Run N independent simulations and aggregate statistics.

        Args:
            n_runs: Number of independent trajectories.
            x0_values: Initial states for each run (uses config x0 if None).

        Returns:
            MonteCarloResult with collapse probability and mean risk.
        """
        if n_runs <= 0:
            raise ValueError(f"n_runs must be > 0, got {n_runs}")

        collapse_count = 0
        emergence_count = 0
        risks: list[float] = []
        peaks: list[float] = []

        for i in range(n_runs):
            x0 = x0_values[i] if x0_values is not None and i < len(x0_values) else self.config.x0
            # Vary seed per run for independence
            original_seed = self.config.seed
            object.__setattr__(
                self.config,
                "seed",
                (original_seed or 0) + i if original_seed is not None else None,
            )
            traj = self.simulate(x0=x0)
            object.__setattr__(self.config, "seed", original_seed)

            if traj.collapsed:
                collapse_count += 1
            if traj.emergence_triggered:
                emergence_count += 1
            risks.append(self.collapse_risk(traj))
            peaks.append(traj.systemic_tension_peak)

        collapse_prob = collapse_count / n_runs
        mean_risk = sum(risks) / n_runs
        emergence_prob = emergence_count / n_runs
        return MonteCarloResult(
            n_runs=n_runs,
            collapse_probability=collapse_prob,
            emergence_probability=emergence_prob,
            mean_risk=mean_risk,
            peak_tensions=tuple(peaks),
        )


@dataclass(frozen=True)
class MonteCarloResult:
    """Aggregate result of a Monte Carlo collapse simulation ensemble.

    Attributes:
        n_runs: Number of independent trajectories.
        collapse_probability: Fraction of runs that collapsed.
        emergence_probability: Fraction of runs with a Prigogine bifurcation.
        mean_risk: Mean collapse risk score across runs.
        peak_tensions: Peak systemic tension per run.
    """

    n_runs: int
    collapse_probability: float
    emergence_probability: float
    mean_risk: float
    peak_tensions: tuple[float, ...]

    @property
    def mean_peak_tension(self) -> float:
        """Mean peak systemic tension across all runs."""
        if not self.peak_tensions:
            return 0.0
        return sum(self.peak_tensions) / len(self.peak_tensions)

    @property
    def critical(self) -> bool:
        """True when collapse_probability > 0.5 (majority-collapse regime)."""
        return self.collapse_probability > 0.5
