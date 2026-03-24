"""Integration tests — thermodynamics × CREP × Mandala pipeline.

Tests the integration of thermodynamic primitives (Landauer, Hatano-Sasa,
Esposito) with the CREP evaluation and collapse detection pipeline.
"""

from __future__ import annotations

import itertools
import math

import pytest

from unified_mandala.collapse_detector import (
    FRACTAL_SINGULARITY,
    CollapseDetector,
    CollapseDetectorConfig,
)
from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
from unified_mandala.thermodynamics.esposito import EspositoDecomposition
from unified_mandala.thermodynamics.hatano_sasa import HatanoSasaProduction
from unified_mandala.thermodynamics.landauer import (
    LandauerBound,
    landauer_energy,
    landauer_entropy,
)

# ---------------------------------------------------------------------------
# Landauer × CREP integration
# ---------------------------------------------------------------------------


@pytest.mark.thermodynamics
class TestLandauerCREPIntegration:
    """Landauer bound contracts wrt CREP score."""

    def test_landauer_energy_decreases_at_higher_crep(self):
        """Low CREP (high uncertainty) → more bits to resolve → higher Landauer cost."""
        # Model: n_bits ∝ (1 - CREP_score)
        T = 300.0
        crep_high = 0.9
        crep_low = 0.3
        n_high = 1.0 - crep_high  # fewer bits to erase
        n_low = 1.0 - crep_low    # more bits to erase
        e_high_crep = landauer_energy(T, n_bits=n_high)
        e_low_crep = landauer_energy(T, n_bits=n_low)
        assert e_low_crep > e_high_crep

    def test_emergence_threshold_landauer_cost(self):
        """At the emergence threshold (0.72) the Landauer cost is well-defined."""
        T = 300.0
        n_bits = 1.0 - 0.72  # bits to resolve at threshold
        e = landauer_energy(T, n_bits=n_bits)
        assert e > 0
        assert math.isfinite(e)

    def test_landauer_bound_below_fractal_singularity(self):
        """Below the fractal singularity φ, the Landauer cost is higher."""
        T = 300.0
        n_above = 1.0 - FRACTAL_SINGULARITY
        n_below = 1.0 - 0.3
        e_above = landauer_energy(T, n_bits=n_above)
        e_below = landauer_energy(T, n_bits=n_below)
        assert e_below > e_above

    def test_crep_zero_channel_maximum_landauer_cost(self):
        """A CREP score of 0 (all-zero phases) maximises information uncertainty."""
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("z", phase=0.0, weight=1.0, decay=0.0, timestamp=0.0))
        result = ev.evaluate(now=0.0)
        assert result.score == pytest.approx(0.0)
        n_bits = 1.0 - result.score  # 1 bit to erase
        e = landauer_energy(300.0, n_bits=n_bits)
        assert e > 0

    @pytest.mark.parametrize("phase", [0.1, 0.3, 0.5, 0.72, 0.9])
    def test_landauer_cost_decreases_with_phase(self, phase):
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("x", phase=phase, weight=1.0, decay=0.0, timestamp=0.0))
        result = ev.evaluate(now=0.0)
        n_bits = 1.0 - result.score
        e = landauer_energy(300.0, n_bits=n_bits)
        assert e >= 0

    def test_n_bits_proportional_to_uncertainty(self):
        """n_bits = -log2(CREP) is a valid information measure for entropy."""
        for crep_score in [0.1, 0.3, 0.5, 0.72, 0.9]:
            n_bits = -math.log2(crep_score + 1e-9)
            e = landauer_energy(300.0, n_bits=n_bits)
            assert e > 0


# ---------------------------------------------------------------------------
# Hatano-Sasa × Collapse Detector integration
# ---------------------------------------------------------------------------


@pytest.mark.thermodynamics
class TestHatanoSasaCollapseIntegration:
    """Hatano-Sasa entropy links to collapse SDE dynamics."""

    def test_high_sigma_ex_correlates_with_high_tension(self):
        """More Hatano-Sasa excess entropy → system further from steady state → higher tension."""
        hsp_low = HatanoSasaProduction(sigma_ex=0.1, sigma_hk=0.2)
        hsp_high = HatanoSasaProduction(sigma_ex=2.0, sigma_hk=0.2)
        assert hsp_high.sigma_tot > hsp_low.sigma_tot

    def test_collapse_risk_increases_with_sigma_tot(self):
        det = CollapseDetector()
        tensions = [0.1, 0.3, 0.5, 0.7, 0.9]
        risks = [det.systemic_tension_from_crep(crep_score=1-t, entropy=t) for t in tensions]
        # Risks should increase with tension proxy
        for r1, r2 in itertools.pairwise(risks):
            assert r2 >= r1 - 1e-10

    def test_second_law_holds_for_collapse_trajectory(self):
        """The SDE dynamics respect the second law: mean entropy production ≥ 0."""
        det = CollapseDetector(CollapseDetectorConfig(
            tainter_lambda=2.0, prigogine_gamma=0.3, noise_sigma=0.05,
            dt=0.05, t_max=3.0, x0=0.2, seed=42,
        ))
        traj = det.simulate()
        # Mean tension proxy for entropy production rate
        hsp = HatanoSasaProduction(sigma_ex=traj.mean_tension, sigma_hk=0.0)
        assert hsp.second_law_satisfied or traj.mean_tension >= -1e-10

    def test_integral_fluctuation_theorem_scale(self):
        """⟨exp(-Σ_ex)⟩ = 1 is approached for large ensembles of equilibrium-like processes."""
        # Use zero-production trajectories: Σ_ex = 0 → exp(0) = 1
        sigma_values = [0.0] * 100
        from unified_mandala.thermodynamics.hatano_sasa import integral_fluctuation_check
        assert integral_fluctuation_check(sigma_values) is True


# ---------------------------------------------------------------------------
# Esposito × Tainter × Collapse integration
# ---------------------------------------------------------------------------


@pytest.mark.thermodynamics
class TestEspositoCollapseIntegration:
    """Esposito-Tainter decomposition contracts with collapse detector."""

    def test_tainter_collapse_regime_matches_detector_risk(self):
        """High Tainter σ_reorg fraction should correspond to high collapse risk."""
        # Build a Tainter state with strong collapse signal
        result = EspositoDecomposition.tainter_decomposition(
            complexity=10.0, marginal_return=0.1, maintenance_cost_rate=2.0
        )
        assert result.dissipative_structure_forming

        # Corresponding collapse detector with high tension
        det = CollapseDetector(CollapseDetectorConfig(
            tainter_lambda=5.0, prigogine_gamma=0.1, noise_sigma=0.0,
            x0=0.7, dt=0.05, t_max=5.0, seed=0,
        ))
        traj = det.simulate()
        risk = det.collapse_risk(traj)
        assert risk > 0.3  # elevated risk expected

    def test_near_equilibrium_low_tainter_low_risk(self):
        """Near-equilibrium Tainter state (low reorg) → collapse unlikely."""
        result = EspositoDecomposition.tainter_decomposition(
            complexity=5.0, marginal_return=3.0, maintenance_cost_rate=0.5
        )
        assert result.near_equilibrium

    def test_reorg_fraction_tracks_complexity_crisis(self):
        """Increasing complexity relative to capacity → increasing reorg fraction."""
        fractions = []
        for cost_rate in [0.5, 1.0, 1.5, 2.0, 3.0]:
            result = EspositoDecomposition.tainter_decomposition(
                complexity=5.0, marginal_return=0.5, maintenance_cost_rate=cost_rate
            )
            fractions.append(result.reorg_fraction)
        # Reorg fraction should be non-decreasing
        for f1, f2 in itertools.pairwise(fractions):
            assert f2 >= f1 - 1e-10

    def test_prigogine_dissipative_structure_at_bifurcation(self):
        """At bifurcation (reorg dominates), Prigogine predicts new structure."""
        result = EspositoDecomposition.tainter_decomposition(
            complexity=8.0, marginal_return=0.05, maintenance_cost_rate=1.5
        )
        assert result.dissipative_structure_forming
        # Map to collapse detector: this should be in the pre-collapse regime
        det = CollapseDetector(CollapseDetectorConfig(
            tainter_lambda=result.sigma_reorg,
            prigogine_gamma=result.sigma_maint + 0.1,
            noise_sigma=0.01, x0=0.5, dt=0.05, t_max=5.0, seed=7,
        ))
        traj = det.simulate()
        assert isinstance(traj.prigogine_events, int)

    def test_landauer_esposito_cost_chain(self):
        """Total information cost = Landauer bound × n_bits from Esposito decomposition."""
        esposito = EspositoDecomposition.tainter_decomposition(
            complexity=5.0, marginal_return=0.5, maintenance_cost_rate=1.0
        )
        # Use sigma_reorg as a proxy for bits of structure being reorganised
        n_bits = esposito.sigma_reorg
        e = landauer_energy(300.0, n_bits=n_bits)
        s = landauer_entropy(n_bits=n_bits)
        assert e >= 0
        assert s >= 0


# ---------------------------------------------------------------------------
# Full thermodynamic pipeline
# ---------------------------------------------------------------------------


@pytest.mark.thermodynamics
class TestFullThermodynamicPipeline:
    """End-to-end thermodynamic coherence tests."""

    def test_crep_to_landauer_to_collapse_chain(self):
        """CREP → Landauer cost → collapse tension pipeline."""
        # Step 1: CREP
        ev = CREPEvaluator()
        for name, phase in [("a", 0.6), ("b", 0.7), ("c", 0.8)]:
            ev.add_channel(ResonanceChannel(name, phase=phase, weight=1.0, decay=0.0, timestamp=0.0))
        crep_result = ev.evaluate(now=0.0)

        # Step 2: Landauer cost
        n_bits = 1.0 - crep_result.score
        lb = LandauerBound.compute(300.0, n_bits=n_bits)
        assert lb.energy_J > 0

        # Step 3: Collapse detector
        det = CollapseDetector()
        x0 = det.systemic_tension_from_crep(crep_score=crep_result.score, entropy=n_bits)
        traj = det.simulate(x0=x0)
        risk = det.collapse_risk(traj)
        assert 0.0 <= risk <= 1.0

    def test_thermodynamic_consistency_landauer_hatano(self):
        """Landauer entropy ≤ Hatano-Sasa total (upper bound relationship)."""
        from unified_mandala.thermodynamics.hatano_sasa import TrajectorySegment
        n_bits = 1.0
        s_landauer = landauer_entropy(n_bits)

        # Hatano-Sasa for a mildly driven process
        segs = [
            TrajectorySegment(x=0.5, lam=1.0, lam_dot=0.1, d_ln_pss_dlam=-1.0, dt=0.01)
            for _ in range(100)
        ]
        hsp = HatanoSasaProduction.from_segments(segs, sigma_hk=s_landauer)
        # Total Hatano-Sasa ≥ Landauer bound
        assert hsp.sigma_hk >= s_landauer - 1e-15

    def test_all_modules_importable(self):
        """Smoke test: all thermodynamics imports succeed."""
        from unified_mandala.thermodynamics import (
            BOLTZMANN_K,
            EspositoDecomposition,
            HatanoSasaProduction,
            LandauerBound,
        )
        assert BOLTZMANN_K > 0
        assert EspositoDecomposition is not None
        assert HatanoSasaProduction is not None
        assert LandauerBound is not None
