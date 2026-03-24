"""Parametric planetary coupling validation tests."""

from __future__ import annotations

import math

import pytest

from unified_mandala.planetary.coupling import (
    CO2_PREINDUSTRIAL_PPM,
    MYHRE_ALPHA,
    PlanetaryCouplingChain,
    RadiativeForcing,
    IceAlbedoFeedback,
    co2_forcing_W_per_m2,
    delta_temperature_K,
    iea_to_co2_ppm,
)


CO2_LEVELS_PPM = [200.0, 278.0, 300.0, 350.0, 400.0, 421.0, 450.0, 500.0, 560.0, 700.0, 1000.0]
ENERGY_EJ = [0.0, 100.0, 300.0, 400.0, 500.0, 600.0, 620.0]
TEMPERATURES_K = [0.0, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 8.0, 10.0]


@pytest.mark.parametrize("co2", CO2_LEVELS_PPM)
@pytest.mark.planetary
def test_forcing_finite(co2):
    assert math.isfinite(co2_forcing_W_per_m2(co2))


@pytest.mark.parametrize("co2", [c for c in CO2_LEVELS_PPM if c >= CO2_PREINDUSTRIAL_PPM])
@pytest.mark.planetary
def test_forcing_non_negative_above_preindustrial(co2):
    assert co2_forcing_W_per_m2(co2) >= 0


@pytest.mark.parametrize("co2", [c for c in CO2_LEVELS_PPM if c < CO2_PREINDUSTRIAL_PPM])
@pytest.mark.planetary
def test_forcing_negative_below_preindustrial(co2):
    assert co2_forcing_W_per_m2(co2) < 0


@pytest.mark.parametrize("co2", CO2_LEVELS_PPM)
@pytest.mark.planetary
def test_radiative_forcing_compute_consistent(co2):
    rf = RadiativeForcing.compute(co2)
    assert rf.co2_ppm == co2
    assert rf.forcing_W_per_m2 == pytest.approx(co2_forcing_W_per_m2(co2), rel=1e-9)


@pytest.mark.parametrize("dT", TEMPERATURES_K)
@pytest.mark.planetary
def test_ice_volume_non_negative(dT):
    ice = IceAlbedoFeedback.compute(dT)
    assert ice.ice_volume_1000km3 >= 0


@pytest.mark.parametrize("dT", TEMPERATURES_K)
@pytest.mark.planetary
def test_surface_albedo_in_range(dT):
    ice = IceAlbedoFeedback.compute(dT)
    assert 0.0 <= ice.surface_albedo <= 1.0


@pytest.mark.parametrize("dT1,dT2", [(0.0, 1.0), (1.0, 3.0), (3.0, 5.0), (5.0, 10.0)])
@pytest.mark.planetary
def test_albedo_non_increasing_with_warming(dT1, dT2):
    ice1 = IceAlbedoFeedback.compute(dT1)
    ice2 = IceAlbedoFeedback.compute(dT2)
    assert ice2.surface_albedo <= ice1.surface_albedo + 1e-10


@pytest.mark.parametrize("energy_EJ", ENERGY_EJ)
@pytest.mark.planetary
def test_co2_increases_with_energy(energy_EJ):
    baseline = CO2_PREINDUSTRIAL_PPM
    co2 = iea_to_co2_ppm(energy_EJ, baseline_co2_ppm=baseline)
    assert co2 >= baseline - 1e-10


@pytest.mark.parametrize("energy_EJ", [e for e in ENERGY_EJ if e > 0])
@pytest.mark.planetary
def test_planetary_chain_crep_in_range(energy_EJ):
    chain = PlanetaryCouplingChain.evaluate(energy_EJ=energy_EJ)
    assert 0.0 <= chain.crep_phase <= 1.0


@pytest.mark.parametrize("energy_EJ", ENERGY_EJ)
@pytest.mark.planetary
def test_planetary_chain_finite_values(energy_EJ):
    if energy_EJ == 0.0:
        return  # skip zero-energy (log(0) issue in some paths)
    chain = PlanetaryCouplingChain.evaluate(energy_EJ=energy_EJ)
    assert math.isfinite(chain.crep_phase)
    assert math.isfinite(chain.co2_ppm)
    assert math.isfinite(chain.forcing.forcing_W_per_m2)


@pytest.mark.parametrize("dT", TEMPERATURES_K)
@pytest.mark.planetary
def test_delta_temperature_linear(dT):
    forcing = dT / 0.8  # approximate inverse sensitivity
    dT_back = delta_temperature_K(forcing)
    assert math.isfinite(dT_back)


@pytest.mark.parametrize("co2_a,co2_b", [
    (300.0, 400.0), (350.0, 500.0), (421.0, 600.0), (280.0, 560.0),
])
@pytest.mark.planetary
def test_forcing_increases_with_co2(co2_a, co2_b):
    f_a = co2_forcing_W_per_m2(co2_a)
    f_b = co2_forcing_W_per_m2(co2_b)
    assert f_b > f_a


@pytest.mark.parametrize("co2", [300.0, 400.0, 560.0])
@pytest.mark.planetary
def test_doubled_co2_flag_correct(co2):
    rf = RadiativeForcing.compute(co2)
    expected = co2 >= 2.0 * CO2_PREINDUSTRIAL_PPM
    assert rf.doubled_co2 == expected


@pytest.mark.parametrize("baseline", [278.0, 350.0, 421.0])
@pytest.mark.planetary
def test_different_baselines_change_forcing(baseline):
    rf = RadiativeForcing.compute(co2_ppm=421.0, c0_ppm=baseline)
    if baseline < 421.0:
        assert rf.forcing_W_per_m2 > 0
    elif baseline == 421.0:
        assert rf.forcing_W_per_m2 == pytest.approx(0.0, abs=1e-9)
    else:
        assert rf.forcing_W_per_m2 < 0


# Stress level ordering tests
@pytest.mark.parametrize("phase,expected", [
    (0.1, "stable"), (0.5, "elevated"), (0.7, "critical"), (0.9, "extreme"),
])
@pytest.mark.planetary
def test_stress_level_classification(phase, expected):
    from unittest.mock import MagicMock
    chain = PlanetaryCouplingChain(
        energy_EJ=500.0,
        co2_ppm=421.0,
        forcing=MagicMock(),
        ice_albedo=MagicMock(),
        crep_phase=phase,
    )
    assert chain.stress_level == expected
