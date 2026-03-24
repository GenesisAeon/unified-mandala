"""Esposito-Van den Broeck three-face decomposition of entropy production.

The second law admits a decomposition into three non-negative contributions:

.. math::

   \\sigma_{\\text{tot}} = \\sigma_1 + \\sigma_2 + \\sigma_3 \\geq 0

In the bipartite-system formulation relevant to driven dissipative structures
(Prigogine) and social-complexity collapse (Tainter), the physically
meaningful split is:

.. math::

   \\sigma_{\\text{tot}} = \\sigma_{\\text{maint}} + \\sigma_{\\text{reorg}}

where:

* :math:`\\sigma_{\\text{maint}}` — **maintenance** entropy: produced by
  steady-state probability currents to maintain the non-equilibrium state
  (Prigogine's *minimum entropy production* near equilibrium).
* :math:`\\sigma_{\\text{reorg}}` — **reorganisation** entropy: produced during
  transitions between non-equilibrium steady states (structural phase changes,
  analogous to Tainter's complexity jumps).

The decomposition satisfies:

.. math::

   \\sigma_{\\text{maint}} \\geq 0, \\quad \\sigma_{\\text{reorg}} \\geq 0

References
----------
Esposito, M., & Van den Broeck, C. (2010). Three faces of the second law.
    *Physical Review E*, 82(1), 011143.
    https://doi.org/10.1103/PhysRevE.82.011143

Prigogine, I. (1978). Time, structure, and fluctuations.
    *Science*, 201(4358), 777–785. https://doi.org/10.1126/science.201.4358.777
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import NamedTuple


class EntropyDecomposition(NamedTuple):
    """Named-tuple result of an Esposito decomposition.

    Attributes:
        sigma_maint: Maintenance entropy production (≥ 0).
        sigma_reorg: Reorganisation entropy production (≥ 0).
        sigma_tot: Total entropy production (= sigma_maint + sigma_reorg).
        reorg_fraction: σ_reorg / σ_tot (0 when σ_tot = 0).
        near_equilibrium: True when σ_maint dominates (reorg_fraction < 0.1).
    """

    sigma_maint: float
    sigma_reorg: float

    @property
    def sigma_tot(self) -> float:
        return self.sigma_maint + self.sigma_reorg

    @property
    def reorg_fraction(self) -> float:
        if self.sigma_tot == 0.0:
            return 0.0
        return self.sigma_reorg / self.sigma_tot

    @property
    def near_equilibrium(self) -> bool:
        """True when reorganisation fraction < 10 % (near-equilibrium regime)."""
        return self.reorg_fraction < 0.1

    @property
    def dissipative_structure_forming(self) -> bool:
        """True when σ_reorg > σ_maint — far-from-equilibrium reorganisation."""
        return self.sigma_reorg > self.sigma_maint


class EspositoDecomposition:
    """Compute and accumulate Esposito-Van den Broeck entropy decompositions.

    The decomposition is built from empirical probability distributions
    :math:`p(x)` (current) and :math:`p_{ss}(x)` (target steady-state)
    for a discrete state space.

    Example::

        p_curr = [0.5, 0.3, 0.2]
        p_ss   = [0.4, 0.35, 0.25]
        decomp = EspositoDecomposition()
        result = decomp.from_distributions(p_curr, p_ss, sigma_tot=0.08)
        print(result.sigma_maint, result.sigma_reorg)
    """

    # ------------------------------------------------------------------
    # KL-divergence helper
    # ------------------------------------------------------------------

    @staticmethod
    def kl_divergence(p: list[float], q: list[float]) -> float:
        """Kullback-Leibler divergence D_KL(p ‖ q).

        .. math::

           D_{KL}(p \\| q) = \\sum_i p_i \\ln \\frac{p_i}{q_i}

        Entries with p_i = 0 are skipped (0 ln 0 = 0 by convention).

        Args:
            p: Source distribution (must sum to 1, all entries ≥ 0).
            q: Reference distribution (must sum to 1, all entries > 0 where p > 0).

        Returns:
            D_KL(p ‖ q) ≥ 0.

        Raises:
            ValueError: If lengths differ or q_i = 0 where p_i > 0.
        """
        if len(p) != len(q):
            raise ValueError(f"p and q must have the same length, got {len(p)} vs {len(q)}.")
        kl = 0.0
        for pi, qi in zip(p, q):
            if pi < 0 or qi < 0:
                raise ValueError("All probabilities must be non-negative.")
            if pi == 0.0:
                continue
            if qi == 0.0:
                raise ValueError("q must be > 0 wherever p > 0.")
            kl += pi * math.log(pi / qi)
        return kl

    # ------------------------------------------------------------------
    # Decomposition
    # ------------------------------------------------------------------

    @classmethod
    def from_distributions(
        cls,
        p_curr: list[float],
        p_ss: list[float],
        sigma_tot: float,
    ) -> EntropyDecomposition:
        """Decompose σ_tot into maintenance and reorganisation components.

        The reorganisation contribution is identified with the KL-divergence
        rate between the current and steady-state distributions:

        .. math::

           \\sigma_{\\text{reorg}} = D_{KL}(p_{\\text{curr}} \\| p_{ss})

        and the maintenance remainder:

        .. math::

           \\sigma_{\\text{maint}} = \\sigma_{\\text{tot}} - \\sigma_{\\text{reorg}}

        Both are clamped to ≥ 0 to ensure non-negativity.

        Args:
            p_curr: Current empirical distribution (normalised).
            p_ss: Target steady-state distribution (normalised).
            sigma_tot: Total entropy production from other measurements.

        Returns:
            EntropyDecomposition.
        """
        sigma_reorg = cls.kl_divergence(p_curr, p_ss)
        sigma_maint = max(0.0, sigma_tot - sigma_reorg)
        sigma_reorg = max(0.0, sigma_reorg)
        return EntropyDecomposition(sigma_maint=sigma_maint, sigma_reorg=sigma_reorg)

    @classmethod
    def from_prigogine_rates(
        cls,
        affinities: list[float],
        currents: list[float],
    ) -> EntropyDecomposition:
        """Compute decomposition from thermodynamic forces (affinities) and currents.

        Prigogine's entropy production rate:

        .. math::

           \\dot{S}_i = A_i \\cdot J_i

        where :math:`A_i` are affinities and :math:`J_i` are conjugate
        probability currents (fluxes).  Negative contributions map to
        maintenance; positive to reorganisation.

        Args:
            affinities: Thermodynamic affinities A_i (signed).
            currents: Conjugate probability currents J_i (signed).

        Returns:
            EntropyDecomposition with Prigogine decomposition.

        Raises:
            ValueError: If lengths differ.
        """
        if len(affinities) != len(currents):
            raise ValueError("affinities and currents must have equal length.")
        sigma_maint = 0.0
        sigma_reorg = 0.0
        for a, j in zip(affinities, currents):
            contribution = a * j
            if contribution >= 0:
                sigma_maint += contribution
            else:
                sigma_reorg += abs(contribution)
        return EntropyDecomposition(sigma_maint=sigma_maint, sigma_reorg=sigma_reorg)

    @classmethod
    def tainter_decomposition(
        cls,
        complexity: float,
        marginal_return: float,
        maintenance_cost_rate: float,
    ) -> EntropyDecomposition:
        """Map Tainter's social-complexity law to an entropy decomposition.

        Tainter (1988) argues that societies invest in increasing complexity
        to solve problems; beyond a threshold the marginal return on complexity
        drops below the maintenance cost, driving collapse.

        This maps to the Esposito decomposition as:

        - σ_maint = maintenance_cost_rate × complexity
        - σ_reorg = max(0, maintenance_cost_rate × complexity − marginal_return × complexity)

        When σ_reorg dominates (reorg_fraction > 0.5), the system is in the
        collapse-precursor regime.

        Args:
            complexity: Current system complexity C ≥ 0.
            marginal_return: Productivity gain per unit complexity (≥ 0).
            maintenance_cost_rate: Cost per unit complexity to sustain state (≥ 0).

        Returns:
            EntropyDecomposition reflecting Tainter dynamics.
        """
        if complexity < 0:
            raise ValueError(f"complexity must be >= 0, got {complexity}")
        sigma_maint = maintenance_cost_rate * complexity
        net_gain = marginal_return * complexity
        sigma_reorg = max(0.0, sigma_maint - net_gain)
        sigma_maint_clipped = max(0.0, sigma_maint - sigma_reorg)
        return EntropyDecomposition(sigma_maint=sigma_maint_clipped, sigma_reorg=sigma_reorg)
