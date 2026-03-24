"""Parametric tests for collapse detector — exhaustive λ/γ/σ space coverage."""

from __future__ import annotations

import math

import pytest

from unified_mandala.collapse_detector import (
    FRACTAL_SINGULARITY,
    CollapseDetector,
    CollapseDetectorConfig,
)

LAMBDA_VALUES = [0.5, 1.0, 2.0, 2.5, 3.0, 5.0, 10.0]
GAMMA_VALUES = [0.0, 0.1, 0.3, 0.5, 1.0, 2.0, 5.0]
SIGMA_VALUES = [0.0, 0.02, 0.05, 0.1, 0.2]
X0_VALUES = [0.01, 0.1, 0.3, 0.5, FRACTAL_SINGULARITY, 0.8]


@pytest.mark.parametrize("lam", LAMBDA_VALUES)
@pytest.mark.collapse
def test_simulate_finite_states_all_lambda(lam):
    det = CollapseDetector(
        CollapseDetectorConfig(
            tainter_lambda=lam,
            prigogine_gamma=0.3,
            noise_sigma=0.0,
            dt=0.05,
            t_max=2.0,
            x0=0.1,
            seed=0,
        )
    )
    traj = det.simulate()
    assert all(math.isfinite(x) for x in traj.states)


@pytest.mark.parametrize("gamma", GAMMA_VALUES)
@pytest.mark.collapse
def test_simulate_finite_states_all_gamma(gamma):
    det = CollapseDetector(
        CollapseDetectorConfig(
            tainter_lambda=2.0,
            prigogine_gamma=gamma,
            noise_sigma=0.0,
            dt=0.05,
            t_max=2.0,
            x0=0.1,
            seed=0,
        )
    )
    traj = det.simulate()
    assert all(math.isfinite(x) for x in traj.states)


@pytest.mark.parametrize("sigma", SIGMA_VALUES)
@pytest.mark.collapse
def test_simulate_states_in_unit_interval_all_sigma(sigma):
    det = CollapseDetector(
        CollapseDetectorConfig(
            tainter_lambda=2.0,
            prigogine_gamma=0.3,
            noise_sigma=sigma,
            dt=0.05,
            t_max=2.0,
            x0=0.2,
            seed=7,
        )
    )
    traj = det.simulate()
    assert all(0.0 <= x <= 1.0 for x in traj.states)


@pytest.mark.parametrize("x0", X0_VALUES)
@pytest.mark.collapse
def test_simulate_all_x0_in_range(x0):
    det = CollapseDetector(
        CollapseDetectorConfig(
            tainter_lambda=2.0,
            prigogine_gamma=0.3,
            noise_sigma=0.0,
            dt=0.05,
            t_max=2.0,
            x0=x0,
            seed=0,
        )
    )
    traj = det.simulate()
    assert all(0.0 <= x <= 1.0 for x in traj.states)


@pytest.mark.parametrize("lam", LAMBDA_VALUES)
@pytest.mark.collapse
def test_drift_finite_all_lambda(lam):
    det = CollapseDetector(CollapseDetectorConfig(tainter_lambda=lam))
    for x in [0.0, 0.1, 0.3, FRACTAL_SINGULARITY, 0.8, 1.0]:
        assert math.isfinite(det.drift(x))


@pytest.mark.parametrize("gamma", GAMMA_VALUES)
@pytest.mark.collapse
def test_drift_at_zero_zero_for_all_gamma(gamma):
    det = CollapseDetector(CollapseDetectorConfig(prigogine_gamma=gamma))
    assert det.drift(0.0) == pytest.approx(0.0, abs=1e-12)


@pytest.mark.parametrize("sigma", [0.01, 0.05, 0.1, 0.2, 0.5])
@pytest.mark.collapse
def test_diffusion_max_at_half_all_sigma(sigma):
    det = CollapseDetector(CollapseDetectorConfig(noise_sigma=sigma))
    d_half = det.diffusion(0.5)
    expected = sigma * math.sqrt(0.25)
    assert d_half == pytest.approx(expected, rel=1e-6)


@pytest.mark.parametrize("x0", X0_VALUES)
@pytest.mark.collapse
def test_collapse_risk_in_range_all_x0(x0):
    det = CollapseDetector(
        CollapseDetectorConfig(noise_sigma=0.0, dt=0.1, t_max=2.0, x0=x0, seed=0)
    )
    traj = det.simulate()
    risk = det.collapse_risk(traj)
    assert 0.0 <= risk <= 1.0


@pytest.mark.parametrize(
    "crep,entropy",
    [
        (0.0, 1.0),
        (0.3, 0.7),
        (0.5, 0.5),
        (0.72, 0.28),
        (0.9, 0.1),
        (1.0, 0.0),
    ],
)
@pytest.mark.collapse
def test_systemic_tension_from_crep_range(crep, entropy):
    det = CollapseDetector()
    x0 = det.systemic_tension_from_crep(crep_score=crep, entropy=entropy)
    assert 0.0 <= x0 <= 1.0


@pytest.mark.parametrize("n_runs", [3, 5, 10])
@pytest.mark.collapse
def test_monte_carlo_collapse_prob_valid(n_runs):
    det = CollapseDetector(
        CollapseDetectorConfig(
            noise_sigma=0.05,
            dt=0.1,
            t_max=2.0,
            x0=0.2,
            seed=1,
        )
    )
    result = det.monte_carlo(n_runs)
    assert 0.0 <= result.collapse_probability <= 1.0
    assert result.n_runs == n_runs
