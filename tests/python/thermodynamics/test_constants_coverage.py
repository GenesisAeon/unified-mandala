"""Extra coverage tests for thermodynamic constants and edge cases."""

from __future__ import annotations

import math

import pytest

from unified_mandala.thermodynamics.esposito import EntropyDecomposition, EspositoDecomposition
from unified_mandala.thermodynamics.hatano_sasa import TrajectorySegment, hatano_sasa_excess
from unified_mandala.thermodynamics.landauer import landauer_energy, landauer_entropy


# More Landauer edge cases
@pytest.mark.parametrize("n", [0.1, 0.25, 0.333, 0.5, 0.75, 1.5, 3.14, 7.0, 12.0])
def test_landauer_fractional_bits(n):
    e = landauer_energy(300.0, n_bits=n)
    assert e > 0
    assert math.isfinite(e)


@pytest.mark.parametrize("T", [0.001, 0.01, 0.1, 1.0, 10.0, 100.0, 1000.0, 1e5, 1e8])
def test_landauer_wide_temperature_range(T):
    e = landauer_energy(T)
    assert e > 0
    s = landauer_entropy(1.0)
    assert e == pytest.approx(s * T, rel=1e-9)


# Hatano-Sasa edge cases
def test_hatano_sasa_very_large_lam_dot():
    segs = [TrajectorySegment(x=0.5, lam=1.0, lam_dot=1e6, d_ln_pss_dlam=-1e-6, dt=1e-6)]
    result = hatano_sasa_excess(segs)
    assert math.isfinite(result)


def test_hatano_sasa_very_small_dt():
    segs = [TrajectorySegment(x=0.5, lam=1.0, lam_dot=1.0, d_ln_pss_dlam=-1.0, dt=1e-10)]
    result = hatano_sasa_excess(segs)
    assert result == pytest.approx(1e-10, abs=1e-15)


# Esposito distribution edge cases
@pytest.mark.parametrize("n_states", [1, 2, 3, 5, 10, 20])
def test_kl_uniform_distributions(n_states):
    p = [1.0 / n_states] * n_states
    kl = EspositoDecomposition.kl_divergence(p, p)
    assert kl == pytest.approx(0.0, abs=1e-12)


@pytest.mark.parametrize("n_states", [2, 3, 5])
def test_from_distributions_identical_zero_reorg(n_states):
    p = [1.0 / n_states] * n_states
    result = EspositoDecomposition.from_distributions(p, p, sigma_tot=1.0)
    assert result.sigma_reorg == pytest.approx(0.0, abs=1e-12)


@pytest.mark.parametrize("complexity", [0.1, 1.0, 5.0, 10.0, 50.0, 100.0])
def test_tainter_zero_marginal_return_max_reorg(complexity):
    result = EspositoDecomposition.tainter_decomposition(
        complexity=complexity, marginal_return=0.0, maintenance_cost_rate=1.0
    )
    assert result.sigma_reorg > 0


@pytest.mark.parametrize("i", range(5))
def test_entropydecomposition_immutable_tuple(i):
    ed = EntropyDecomposition(sigma_maint=float(i), sigma_reorg=float(i + 1))
    assert ed.sigma_maint == float(i)
    assert ed.sigma_reorg == float(i + 1)
