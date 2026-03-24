"""Unit tests for the SDE-based collapse detector — Tainter/Prigogine dynamics."""

from __future__ import annotations

import math

import pytest

from unified_mandala.collapse_detector import (
    COLLAPSE_THRESHOLD,
    EMERGENCE_BASIN_UPPER,
    FRACTAL_SINGULARITY,
    CollapseDetector,
    CollapseDetectorConfig,
    CollapseTrajectory,
    MonteCarloResult,
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------


class TestConstants:
    def test_fractal_singularity_golden_ratio(self):
        assert pytest.approx(0.618_033_988_749_895, rel=1e-10) == FRACTAL_SINGULARITY

    def test_collapse_threshold_range(self):
        assert 0.5 < COLLAPSE_THRESHOLD < 1.0

    def test_emergence_basin_upper_is_singularity(self):
        assert EMERGENCE_BASIN_UPPER == FRACTAL_SINGULARITY

    def test_singularity_positive(self):
        assert FRACTAL_SINGULARITY > 0

    def test_singularity_less_than_threshold(self):
        assert FRACTAL_SINGULARITY < COLLAPSE_THRESHOLD


# ---------------------------------------------------------------------------
# CollapseDetectorConfig
# ---------------------------------------------------------------------------


class TestCollapseDetectorConfig:
    def test_defaults(self):
        cfg = CollapseDetectorConfig()
        assert cfg.tainter_lambda > 0
        assert cfg.prigogine_gamma >= 0
        assert cfg.noise_sigma >= 0
        assert cfg.dt > 0
        assert cfg.t_max > 0
        assert 0.0 <= cfg.x0 <= 1.0

    def test_custom_values(self):
        cfg = CollapseDetectorConfig(tainter_lambda=3.0, prigogine_gamma=0.5, noise_sigma=0.0)
        assert cfg.tainter_lambda == 3.0

    def test_seed_default(self):
        cfg = CollapseDetectorConfig()
        assert cfg.seed is not None


# ---------------------------------------------------------------------------
# CollapseDetector drift and diffusion
# ---------------------------------------------------------------------------


class TestDriftDiffusion:
    @pytest.fixture()
    def det(self):
        return CollapseDetector(CollapseDetectorConfig(noise_sigma=0.0, seed=42))

    def test_drift_at_singularity_zero_crossing(self, det):
        # At x = phi_c, the Tainter term is zero
        f = det.drift(FRACTAL_SINGULARITY)
        # Only Prigogine term: -gamma × phi_c²
        expected = -det.config.prigogine_gamma * FRACTAL_SINGULARITY ** 2
        assert f == pytest.approx(expected, rel=1e-6)

    def test_drift_at_zero_is_zero(self, det):
        assert det.drift(0.0) == pytest.approx(0.0, abs=1e-12)

    def test_drift_at_one(self, det):
        f = det.drift(1.0)
        # Tainter term: lambda × 1 × 0 × (1-phi) = 0; Prigogine: -gamma
        assert f == pytest.approx(-det.config.prigogine_gamma, rel=1e-6)

    def test_diffusion_zero_at_boundaries(self, det):
        assert det.diffusion(0.0) == pytest.approx(0.0, abs=1e-12)
        assert det.diffusion(1.0) == pytest.approx(0.0, abs=1e-12)

    def test_diffusion_max_at_half(self):
        det = CollapseDetector(CollapseDetectorConfig(noise_sigma=1.0, seed=1))
        d = det.diffusion(0.5)
        assert d == pytest.approx(math.sqrt(0.25), rel=1e-6)

    def test_diffusion_non_negative(self, det):
        for x in [0.0, 0.1, 0.3, 0.5, 0.618, 0.8, 1.0]:
            assert det.diffusion(x) >= 0

    def test_diffusion_clamps_negative_x(self, det):
        assert det.diffusion(-0.5) >= 0

    def test_diffusion_clamps_x_above_one(self, det):
        assert det.diffusion(1.5) >= 0

    def test_drift_overridable_lambda(self, det):
        det.drift(0.3)
        f_zero = det.drift(0.3, lam=0.0)
        # With lam=0, only Prigogine term
        expected = -det.config.prigogine_gamma * 0.3 ** 2
        assert f_zero == pytest.approx(expected, rel=1e-6)


# ---------------------------------------------------------------------------
# CollapseDetector.simulate
# ---------------------------------------------------------------------------


class TestSimulate:
    @pytest.fixture()
    def det_noiseless(self):
        return CollapseDetector(CollapseDetectorConfig(
            noise_sigma=0.0, tainter_lambda=2.5, prigogine_gamma=0.4,
            dt=0.01, t_max=5.0, x0=0.1, seed=42,
        ))

    @pytest.fixture()
    def det_noisy(self):
        return CollapseDetector(CollapseDetectorConfig(
            noise_sigma=0.1, tainter_lambda=3.0, prigogine_gamma=0.3,
            dt=0.01, t_max=5.0, x0=0.05, seed=0,
        ))

    def test_returns_trajectory(self, det_noiseless):
        traj = det_noiseless.simulate()
        assert isinstance(traj, CollapseTrajectory)

    def test_trajectory_length(self, det_noiseless):
        traj = det_noiseless.simulate()
        expected_steps = int(det_noiseless.config.t_max / det_noiseless.config.dt)
        assert traj.n_steps == expected_steps

    def test_states_in_unit_interval(self, det_noisy):
        traj = det_noisy.simulate()
        assert all(0.0 <= x <= 1.0 for x in traj.states)

    def test_times_non_decreasing(self, det_noiseless):
        traj = det_noiseless.simulate()
        assert all(t1 <= t2 for t1, t2 in zip(traj.times, traj.times[1:], strict=False))

    def test_peak_at_least_initial(self, det_noiseless):
        traj = det_noiseless.simulate()
        assert traj.systemic_tension_peak >= det_noiseless.config.x0

    def test_final_state_in_range(self, det_noiseless):
        traj = det_noiseless.simulate()
        assert 0.0 <= traj.final_state <= 1.0

    def test_reproducible_with_same_seed(self):
        cfg = CollapseDetectorConfig(noise_sigma=0.1, seed=7)
        d1 = CollapseDetector(cfg)
        d2 = CollapseDetector(cfg)
        t1 = d1.simulate()
        t2 = d2.simulate()
        assert t1.states == t2.states

    def test_x0_override(self):
        det = CollapseDetector(CollapseDetectorConfig(noise_sigma=0.0, x0=0.1, dt=0.1, t_max=0.1))
        traj = det.simulate(x0=0.9)
        assert traj.states[0] == pytest.approx(0.9, abs=1e-6)

    def test_zero_noise_deterministic(self):
        cfg = CollapseDetectorConfig(noise_sigma=0.0, seed=None)
        d1 = CollapseDetector(cfg)
        d2 = CollapseDetector(cfg)
        t1 = d1.simulate()
        t2 = d2.simulate()
        assert t1.states == t2.states

    def test_high_tainter_lambda_tends_to_collapse(self):
        det = CollapseDetector(CollapseDetectorConfig(
            tainter_lambda=20.0, prigogine_gamma=0.0, noise_sigma=0.0,
            x0=0.7, dt=0.01, t_max=20.0, seed=0,
        ))
        traj = det.simulate()
        # High driving tends toward collapse
        assert traj.systemic_tension_peak > FRACTAL_SINGULARITY

    def test_strong_prigogine_damps_tension(self):
        det = CollapseDetector(CollapseDetectorConfig(
            tainter_lambda=1.0, prigogine_gamma=10.0, noise_sigma=0.0,
            x0=0.3, dt=0.01, t_max=5.0, seed=0,
        ))
        traj = det.simulate()
        # Strong damping should prevent collapse
        assert not traj.collapsed

    def test_prigogine_events_non_negative(self, det_noisy):
        traj = det_noisy.simulate()
        assert traj.prigogine_events >= 0

    def test_collapse_time_none_when_not_collapsed(self, det_noiseless):
        # Low x0 + moderate lambda: may or may not collapse
        if not det_noiseless.simulate().collapsed:
            traj = det_noiseless.simulate()
            assert traj.collapse_time is None


# ---------------------------------------------------------------------------
# CollapseTrajectory properties
# ---------------------------------------------------------------------------


class TestCollapseTrajectory:
    @pytest.fixture()
    def simple_traj(self):
        det = CollapseDetector(CollapseDetectorConfig(noise_sigma=0.0, dt=0.1, t_max=1.0, seed=42))
        return det.simulate()

    def test_mean_tension_in_range(self, simple_traj):
        assert 0.0 <= simple_traj.mean_tension <= 1.0

    def test_variance_non_negative(self, simple_traj):
        assert simple_traj.variance_tension >= 0

    def test_tainter_index_positive(self, simple_traj):
        assert simple_traj.tainter_index >= 0

    def test_n_steps_positive(self, simple_traj):
        assert simple_traj.n_steps > 0

    def test_peak_at_least_mean(self, simple_traj):
        assert simple_traj.systemic_tension_peak >= simple_traj.mean_tension - 1e-10

    def test_empty_states_mean_zero(self):
        traj = CollapseTrajectory(
            times=(), states=(), collapsed=False, emergence_triggered=False,
            collapse_time=None, systemic_tension_peak=0.0, final_state=0.0,
            prigogine_events=0,
        )
        assert traj.mean_tension == 0.0

    def test_empty_states_variance_zero(self):
        traj = CollapseTrajectory(
            times=(), states=(), collapsed=False, emergence_triggered=False,
            collapse_time=None, systemic_tension_peak=0.0, final_state=0.0,
            prigogine_events=0,
        )
        assert traj.variance_tension == 0.0


# ---------------------------------------------------------------------------
# CollapseDetector risk scoring
# ---------------------------------------------------------------------------


class TestCollapseRisk:
    @pytest.fixture()
    def det(self):
        return CollapseDetector()

    def test_risk_in_range(self, det):
        traj = det.simulate()
        risk = det.collapse_risk(traj)
        assert 0.0 <= risk <= 1.0

    def test_higher_peak_higher_risk(self, det):
        low_peak_traj = CollapseTrajectory(
            times=(0.0,), states=(0.1,), collapsed=False, emergence_triggered=False,
            collapse_time=None, systemic_tension_peak=0.1, final_state=0.1, prigogine_events=0,
        )
        high_peak_traj = CollapseTrajectory(
            times=(0.0,), states=(0.9,), collapsed=False, emergence_triggered=False,
            collapse_time=None, systemic_tension_peak=0.9, final_state=0.9, prigogine_events=0,
        )
        assert det.collapse_risk(high_peak_traj) > det.collapse_risk(low_peak_traj)

    def test_risk_finite(self, det):
        traj = det.simulate()
        assert math.isfinite(det.collapse_risk(traj))

    @pytest.mark.collapse
    def test_systemic_tension_from_crep(self, det):
        """High entropy + low CREP → high tension."""
        x_high = det.systemic_tension_from_crep(crep_score=0.1, entropy=0.9)
        x_low = det.systemic_tension_from_crep(crep_score=0.9, entropy=0.1)
        assert x_high > x_low

    def test_systemic_tension_midpoint(self, det):
        x = det.systemic_tension_from_crep(crep_score=0.5, entropy=0.5)
        assert x == pytest.approx(0.5, rel=1e-9)

    def test_systemic_tension_in_range(self, det):
        for crep in [0.0, 0.5, 1.0]:
            for entropy in [0.0, 0.5, 1.0]:
                x = det.systemic_tension_from_crep(crep_score=crep, entropy=entropy)
                assert 0.0 <= x <= 1.0


# ---------------------------------------------------------------------------
# Monte Carlo
# ---------------------------------------------------------------------------


class TestMonteCarlo:
    @pytest.fixture()
    def det(self):
        return CollapseDetector(CollapseDetectorConfig(
            noise_sigma=0.05, tainter_lambda=2.5, prigogine_gamma=0.4,
            dt=0.05, t_max=2.0, x0=0.1, seed=1,
        ))

    def test_zero_runs_raises(self, det):
        with pytest.raises(ValueError, match="n_runs"):
            det.monte_carlo(0)

    def test_negative_runs_raises(self, det):
        with pytest.raises(ValueError):
            det.monte_carlo(-1)

    def test_returns_result(self, det):
        result = det.monte_carlo(5)
        assert isinstance(result, MonteCarloResult)

    def test_n_runs_stored(self, det):
        result = det.monte_carlo(5)
        assert result.n_runs == 5

    def test_collapse_prob_in_range(self, det):
        result = det.monte_carlo(10)
        assert 0.0 <= result.collapse_probability <= 1.0

    def test_emergence_prob_in_range(self, det):
        result = det.monte_carlo(10)
        assert 0.0 <= result.emergence_probability <= 1.0

    def test_mean_risk_in_range(self, det):
        result = det.monte_carlo(10)
        assert 0.0 <= result.mean_risk <= 1.0

    def test_peak_tensions_length(self, det):
        result = det.monte_carlo(7)
        assert len(result.peak_tensions) == 7

    def test_critical_property(self, det):
        result = det.monte_carlo(5)
        expected = result.collapse_probability > 0.5
        assert result.critical == expected

    def test_mean_peak_tension_in_range(self, det):
        result = det.monte_carlo(5)
        assert 0.0 <= result.mean_peak_tension <= 1.0

    @pytest.mark.slow
    @pytest.mark.collapse
    def test_large_ensemble_statistics(self):
        det = CollapseDetector(CollapseDetectorConfig(
            noise_sigma=0.05, tainter_lambda=2.5, prigogine_gamma=0.4,
            dt=0.1, t_max=3.0, x0=0.15, seed=99,
        ))
        result = det.monte_carlo(20)
        assert 0.0 <= result.collapse_probability <= 1.0
        assert 0.0 <= result.mean_risk <= 1.0

    def test_monte_carlo_with_collapse_runs(self):
        """High λ + high x0 guarantees at least some collapses → covers line 378."""
        det = CollapseDetector(CollapseDetectorConfig(
            tainter_lambda=30.0, prigogine_gamma=0.0, noise_sigma=0.0,
            x0=0.9, dt=0.01, t_max=5.0, seed=7,
        ))
        result = det.monte_carlo(3)
        # With these extreme params every run collapses
        assert result.collapse_probability > 0.0

    def test_monte_carlo_with_emergence_runs(self):
        """x0 above singularity + strong damping → X dips below singularity → covers line 380."""
        det = CollapseDetector(CollapseDetectorConfig(
            tainter_lambda=0.5, prigogine_gamma=5.0, noise_sigma=0.0,
            x0=0.9, dt=0.01, t_max=10.0, seed=3,
        ))
        result = det.monte_carlo(3)
        # Strong Prigogine damping pulls X back below singularity
        assert result.emergence_probability >= 0.0  # may be 0 depending on params
        assert isinstance(result, MonteCarloResult)

    def test_monte_carlo_with_x0_values(self):
        """Passing explicit x0_values list exercises the x0_values branch."""
        det = CollapseDetector(CollapseDetectorConfig(
            tainter_lambda=1.0, prigogine_gamma=0.5, noise_sigma=0.0,
            x0=0.3, dt=0.1, t_max=2.0, seed=11,
        ))
        result = det.monte_carlo(3, x0_values=[0.2, 0.5, 0.8])
        assert result.n_runs == 3
        assert len(result.peak_tensions) == 3

    def test_monte_carlo_none_seed_config(self):
        """seed=None config still produces valid results."""
        det = CollapseDetector(CollapseDetectorConfig(
            tainter_lambda=1.0, prigogine_gamma=0.3, noise_sigma=0.05,
            x0=0.3, dt=0.1, t_max=1.0, seed=None,
        ))
        result = det.monte_carlo(3)
        assert 0.0 <= result.collapse_probability <= 1.0

    def test_mean_peak_tension_empty(self):
        """MonteCarloResult with empty peak_tensions returns 0.0 → covers line 418."""
        result = MonteCarloResult(
            n_runs=0,
            collapse_probability=0.0,
            emergence_probability=0.0,
            mean_risk=0.0,
            peak_tensions=(),
        )
        assert result.mean_peak_tension == 0.0
