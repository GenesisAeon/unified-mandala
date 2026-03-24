"""Parametric thermodynamic contract tests — exhaustive property-based coverage.

These tests use extensive parametrisation to verify physical invariants
across the full supported parameter space of the thermodynamics module.
"""

from __future__ import annotations

import math

import pytest

from unified_mandala.thermodynamics.esposito import EntropyDecomposition, EspositoDecomposition
from unified_mandala.thermodynamics.hatano_sasa import HatanoSasaProduction, TrajectorySegment
from unified_mandala.thermodynamics.landauer import (
    landauer_efficiency,
    landauer_energy,
    landauer_entropy,
    landauer_temperature_from_energy,
)

# ---------------------------------------------------------------------------
# Exhaustive Landauer parametric tests
# ---------------------------------------------------------------------------


TEMPERATURES_K = [0.001, 0.01, 0.1, 1.0, 4.2, 77.0, 273.15, 300.0, 373.0, 500.0, 1000.0, 1e4, 1e6]
BIT_COUNTS = [0.0, 0.5, 1.0, 2.0, 4.0, 8.0, 16.0, 32.0, 64.0, 128.0, 256.0, 1024.0]


@pytest.mark.parametrize("T", TEMPERATURES_K)
@pytest.mark.thermodynamics
def test_landauer_energy_positive_all_temperatures(T):
    """E = k_B T ln2 > 0 for all T > 0."""
    assert landauer_energy(T, n_bits=1.0) > 0


@pytest.mark.parametrize("n", BIT_COUNTS)
@pytest.mark.thermodynamics
def test_landauer_energy_non_negative_all_bit_counts(n):
    """E ≥ 0 for all n ≥ 0."""
    assert landauer_energy(300.0, n_bits=n) >= 0


@pytest.mark.parametrize("T", [1.0, 77.0, 300.0, 1000.0])
@pytest.mark.parametrize("n", [1.0, 8.0, 64.0])
@pytest.mark.thermodynamics
def test_landauer_round_trip(T, n):
    """Temperature round-trip: T → E → T is exact."""
    e = landauer_energy(T, n_bits=n)
    T_back = landauer_temperature_from_energy(e, n_bits=n)
    assert T_back == pytest.approx(T, rel=1e-9)


@pytest.mark.parametrize("n", [1.0, 2.0, 8.0])
@pytest.mark.thermodynamics
def test_landauer_entropy_consistent_with_energy(n):
    """Δs = E(T) / T at any temperature."""
    T = 300.0
    e = landauer_energy(T, n_bits=n)
    s = landauer_entropy(n_bits=n)
    assert s == pytest.approx(e / T, rel=1e-9)


@pytest.mark.parametrize("T", [77.0, 300.0, 1000.0])
@pytest.mark.thermodynamics
def test_landauer_efficiency_ideal_is_one(T):
    """Efficiency = 1 when actual energy equals minimum."""
    e_min = landauer_energy(T)
    eta = landauer_efficiency(e_min, T)
    assert eta == pytest.approx(1.0, rel=1e-9)


@pytest.mark.parametrize("factor", [1.1, 2.0, 5.0, 10.0, 100.0])
@pytest.mark.thermodynamics
def test_landauer_efficiency_below_one_for_excess(factor):
    """Efficiency < 1 whenever actual energy > minimum."""
    e_min = landauer_energy(300.0)
    eta = landauer_efficiency(e_min * factor, 300.0)
    assert eta < 1.0 + 1e-12


@pytest.mark.parametrize("T1,T2", [
    (1.0, 2.0), (77.0, 300.0), (300.0, 600.0), (1000.0, 5000.0),
])
@pytest.mark.thermodynamics
def test_landauer_energy_monotone_temperature(T1, T2):
    """E(T) is strictly monotone increasing in T."""
    assert landauer_energy(T1) < landauer_energy(T2)


# ---------------------------------------------------------------------------
# Exhaustive Hatano-Sasa parametric tests
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("n_segs", [0, 1, 10, 100])
@pytest.mark.parametrize("lam_dot", [0.0, 0.5, 1.0, -1.0])
@pytest.mark.thermodynamics
def test_hatano_sasa_excess_finite(n_segs, lam_dot):
    """Hatano-Sasa excess is always finite."""
    from unified_mandala.thermodynamics.hatano_sasa import hatano_sasa_excess
    segs = [
        TrajectorySegment(x=0.5, lam=1.0, lam_dot=lam_dot, d_ln_pss_dlam=-1.0, dt=0.01)
        for _ in range(n_segs)
    ]
    result = hatano_sasa_excess(segs)
    assert math.isfinite(result)


@pytest.mark.parametrize("sigma_ex,sigma_hk", [
    (0.0, 0.0), (0.5, 0.5), (1.0, 0.0), (0.0, 1.0), (2.0, 3.0),
])
@pytest.mark.thermodynamics
def test_hatano_sasa_sigma_tot(sigma_ex, sigma_hk):
    """σ_tot = σ_hk + σ_ex always holds."""
    hsp = HatanoSasaProduction(sigma_ex=sigma_ex, sigma_hk=sigma_hk)
    assert hsp.sigma_tot == pytest.approx(sigma_ex + sigma_hk, rel=1e-9)


@pytest.mark.parametrize("sigma_ex", [0.0, 0.1, 0.5, 1.0, 5.0, 10.0])
@pytest.mark.thermodynamics
def test_hatano_sasa_second_law_non_negative_sigma_tot(sigma_ex):
    """σ_tot ≥ 0 for non-negative inputs (second law check)."""
    hsp = HatanoSasaProduction(sigma_ex=sigma_ex, sigma_hk=0.0)
    assert hsp.sigma_tot >= 0


@pytest.mark.parametrize("drift,n", [
    (lambda x: -x, 100),
    (lambda x: -2 * x, 200),
    (lambda x: 0.0, 50),
])
@pytest.mark.thermodynamics
def test_hatano_sasa_from_gaussian_finite(drift, n):
    """from_gaussian_process always produces finite σ_ex."""
    hsp = HatanoSasaProduction.from_gaussian_process(
        n_steps=n, drift_fn=drift, diffusion=0.1, dt=0.01, seed=0
    )
    assert math.isfinite(hsp.sigma_ex)


# ---------------------------------------------------------------------------
# Exhaustive Esposito parametric tests
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("sigma_maint,sigma_reorg", [
    (0.0, 0.0), (1.0, 0.0), (0.0, 1.0), (0.5, 0.5), (2.0, 1.0), (0.3, 3.0),
])
@pytest.mark.thermodynamics
def test_esposito_sigma_tot(sigma_maint, sigma_reorg):
    """σ_tot = σ_maint + σ_reorg always holds."""
    ed = EntropyDecomposition(sigma_maint=sigma_maint, sigma_reorg=sigma_reorg)
    assert ed.sigma_tot == pytest.approx(sigma_maint + sigma_reorg, rel=1e-9)


@pytest.mark.parametrize("sigma_maint,sigma_reorg", [
    (0.0, 0.0), (1.0, 0.0), (0.0, 1.0), (0.5, 0.5),
])
@pytest.mark.thermodynamics
def test_esposito_reorg_fraction_range(sigma_maint, sigma_reorg):
    """reorg_fraction ∈ [0, 1] always."""
    ed = EntropyDecomposition(sigma_maint=sigma_maint, sigma_reorg=sigma_reorg)
    assert 0.0 <= ed.reorg_fraction <= 1.0 + 1e-12


@pytest.mark.parametrize("complexity,marginal,maintenance", [
    (0.0, 1.0, 0.5), (5.0, 2.0, 1.0), (5.0, 0.1, 2.0), (10.0, 0.0, 1.0),
    (1.0, 1.0, 1.0), (100.0, 50.0, 10.0),
])
@pytest.mark.thermodynamics
def test_tainter_non_negative_components(complexity, marginal, maintenance):
    """Tainter decomposition always produces non-negative components."""
    result = EspositoDecomposition.tainter_decomposition(complexity, marginal, maintenance)
    assert result.sigma_maint >= -1e-12
    assert result.sigma_reorg >= -1e-12


@pytest.mark.parametrize("affinities,currents", [
    ([1.0], [1.0]),
    ([1.0, -1.0], [1.0, 1.0]),
    ([0.0, 0.0], [1.0, 1.0]),
    ([2.0, 3.0, -1.0], [0.5, 0.5, 0.5]),
])
@pytest.mark.thermodynamics
def test_prigogine_rates_non_negative(affinities, currents):
    """Prigogine decomposition components are always non-negative."""
    result = EspositoDecomposition.from_prigogine_rates(affinities, currents)
    assert result.sigma_maint >= 0
    assert result.sigma_reorg >= 0


@pytest.mark.parametrize("p,q", [
    ([1.0], [1.0]),
    ([0.5, 0.5], [0.5, 0.5]),
    ([0.7, 0.3], [0.3, 0.7]),
    ([0.9, 0.1], [0.5, 0.5]),
    ([0.25, 0.25, 0.25, 0.25], [0.1, 0.2, 0.3, 0.4]),
])
@pytest.mark.thermodynamics
def test_kl_divergence_non_negative(p, q):
    """D_KL(p||q) ≥ 0 (Gibbs inequality)."""
    kl = EspositoDecomposition.kl_divergence(p, q)
    assert kl >= -1e-12


@pytest.mark.parametrize("p", [
    [1.0], [0.5, 0.5], [0.25, 0.25, 0.25, 0.25],
])
@pytest.mark.thermodynamics
def test_kl_divergence_self_zero(p):
    """D_KL(p||p) = 0."""
    kl = EspositoDecomposition.kl_divergence(p, p)
    assert kl == pytest.approx(0.0, abs=1e-12)
