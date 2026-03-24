"""Planetary coupling validation tests — IEA→CO₂→Forcing→Albedo→Ice."""

from __future__ import annotations

import math

import pytest

from unified_mandala.planetary.coupling import (
    ALBEDO_ICE,
    ALBEDO_OCEAN,
    CO2_PREINDUSTRIAL_PPM,
    CLIMATE_SENSITIVITY_K,
    ICE_VOLUME_REF_1000KM3,
    MYHRE_ALPHA,
    IceAlbedoFeedback,
    PlanetaryCouplingChain,
    RadiativeForcing,
    co2_forcing_W_per_m2,
    delta_temperature_K,
    iea_to_co2_ppm,
)


# ---------------------------------------------------------------------------
# Physical constants
# ---------------------------------------------------------------------------


class TestPhysicalConstants:
    def test_preindustrial_co2(self):
        assert CO2_PREINDUSTRIAL_PPM == pytest.approx(278.0, rel=1e-6)

    def test_myhre_alpha(self):
        assert MYHRE_ALPHA == pytest.approx(5.35, rel=1e-6)

    def test_climate_sensitivity_range(self):
        # IPCC AR6: likely range 2.5–4 K per doubling
        assert 2.0 <= CLIMATE_SENSITIVITY_K <= 5.0

    def test_albedo_ocean_range(self):
        assert 0.0 < ALBEDO_OCEAN < 0.2

    def test_albedo_ice_range(self):
        assert 0.5 < ALBEDO_ICE <= 1.0

    def test_albedo_ice_greater_than_ocean(self):
        assert ALBEDO_ICE > ALBEDO_OCEAN

    def test_ice_volume_ref_positive(self):
        assert ICE_VOLUME_REF_1000KM3 > 0


# ---------------------------------------------------------------------------
# co2_forcing_W_per_m2
# ---------------------------------------------------------------------------


class TestCO2Forcing:
    def test_preindustrial_gives_zero(self):
        # At C = C0, forcing = 0
        assert co2_forcing_W_per_m2(CO2_PREINDUSTRIAL_PPM) == pytest.approx(0.0, abs=1e-9)

    def test_doubling_gives_3_7_W_m2(self):
        # Myhre: 5.35 × ln2 ≈ 3.71 W/m²
        f = co2_forcing_W_per_m2(CO2_PREINDUSTRIAL_PPM * 2)
        assert f == pytest.approx(MYHRE_ALPHA * math.log(2.0), rel=1e-6)

    def test_modern_co2_421ppm(self):
        f = co2_forcing_W_per_m2(421.0)
        assert f > 0  # above preindustrial → positive forcing
        assert f == pytest.approx(MYHRE_ALPHA * math.log(421.0 / CO2_PREINDUSTRIAL_PPM), rel=1e-6)

    def test_below_preindustrial_negative(self):
        f = co2_forcing_W_per_m2(200.0)
        assert f < 0

    def test_zero_co2_raises(self):
        with pytest.raises(ValueError, match="co2_ppm"):
            co2_forcing_W_per_m2(0.0)

    def test_negative_co2_raises(self):
        with pytest.raises(ValueError):
            co2_forcing_W_per_m2(-100.0)

    def test_zero_c0_raises(self):
        with pytest.raises(ValueError, match="c0_ppm"):
            co2_forcing_W_per_m2(400.0, c0_ppm=0.0)

    def test_monotonically_increasing(self):
        co2_values = [200.0, 300.0, 400.0, 500.0, 800.0]
        forcings = [co2_forcing_W_per_m2(c) for c in co2_values]
        assert all(f1 < f2 for f1, f2 in zip(forcings, forcings[1:]))

    def test_logarithmic_formula(self):
        for c in [300.0, 350.0, 421.0, 550.0, 700.0]:
            expected = MYHRE_ALPHA * math.log(c / CO2_PREINDUSTRIAL_PPM)
            assert co2_forcing_W_per_m2(c) == pytest.approx(expected, rel=1e-9)

    def test_custom_reference(self):
        # With c0=400, at c=400: forcing = 0
        assert co2_forcing_W_per_m2(400.0, c0_ppm=400.0) == pytest.approx(0.0, abs=1e-9)

    @pytest.mark.parametrize("co2", [280.0, 350.0, 420.0, 560.0, 1000.0])
    def test_finite_for_valid_range(self, co2):
        assert math.isfinite(co2_forcing_W_per_m2(co2))


# ---------------------------------------------------------------------------
# iea_to_co2_ppm
# ---------------------------------------------------------------------------


class TestIEAToCO2:
    def test_zero_energy_returns_baseline(self):
        co2 = iea_to_co2_ppm(0.0, baseline_co2_ppm=278.0)
        assert co2 == pytest.approx(278.0, abs=1e-6)

    def test_positive_energy_increases_co2(self):
        co2 = iea_to_co2_ppm(600.0)
        assert co2 > CO2_PREINDUSTRIAL_PPM

    def test_linear_in_energy(self):
        co2_100 = iea_to_co2_ppm(100.0, baseline_co2_ppm=0.0)
        co2_200 = iea_to_co2_ppm(200.0, baseline_co2_ppm=0.0)
        assert co2_200 == pytest.approx(2.0 * co2_100, rel=1e-9)

    def test_realistic_iea_2024(self):
        # IEA 2024: ~620 EJ → ~421 ppm with current baseline
        co2 = iea_to_co2_ppm(620.0, baseline_co2_ppm=400.0)
        assert co2 > 400.0  # must increase

    def test_finite_result(self):
        co2 = iea_to_co2_ppm(500.0)
        assert math.isfinite(co2)

    def test_result_positive(self):
        assert iea_to_co2_ppm(500.0) > 0

    def test_different_baselines(self):
        co2_a = iea_to_co2_ppm(400.0, baseline_co2_ppm=278.0)
        co2_b = iea_to_co2_ppm(400.0, baseline_co2_ppm=400.0)
        assert co2_b > co2_a

    @pytest.mark.planetary
    def test_carbon_intensity_sensitivity(self):
        """Higher carbon intensity → higher CO₂ per EJ."""
        co2_low = iea_to_co2_ppm(500.0, carbon_intensity=30.0)
        co2_high = iea_to_co2_ppm(500.0, carbon_intensity=80.0)
        assert co2_high > co2_low


# ---------------------------------------------------------------------------
# delta_temperature_K
# ---------------------------------------------------------------------------


class TestDeltaTemperature:
    def test_zero_forcing_zero_temperature(self):
        assert delta_temperature_K(0.0) == pytest.approx(0.0, abs=1e-12)

    def test_doubling_forcing_matches_ecs(self):
        forcing_2x = MYHRE_ALPHA * math.log(2.0)
        dT = delta_temperature_K(forcing_2x)
        assert dT == pytest.approx(CLIMATE_SENSITIVITY_K, rel=0.01)

    def test_negative_forcing_cooling(self):
        dT = delta_temperature_K(-1.0)
        assert dT < 0

    def test_linear_in_forcing(self):
        dT1 = delta_temperature_K(1.0)
        dT3 = delta_temperature_K(3.0)
        assert dT3 == pytest.approx(3.0 * dT1, rel=1e-9)

    @pytest.mark.parametrize("f", [-5.0, -1.0, 0.0, 1.0, 3.7, 8.0])
    def test_finite(self, f):
        assert math.isfinite(delta_temperature_K(f))


# ---------------------------------------------------------------------------
# RadiativeForcing
# ---------------------------------------------------------------------------


class TestRadiativeForcing:
    def test_compute_preindustrial(self):
        rf = RadiativeForcing.compute(CO2_PREINDUSTRIAL_PPM)
        assert rf.forcing_W_per_m2 == pytest.approx(0.0, abs=1e-9)
        assert rf.delta_T_K == pytest.approx(0.0, abs=1e-9)
        assert not rf.doubled_co2

    def test_doubled_co2_flag(self):
        rf = RadiativeForcing.compute(CO2_PREINDUSTRIAL_PPM * 2.0)
        assert rf.doubled_co2 is True

    def test_frozen(self):
        rf = RadiativeForcing.compute(400.0)
        with pytest.raises(AttributeError):
            rf.co2_ppm = 500.0  # type: ignore[misc]

    def test_delta_t_positive_above_preindustrial(self):
        rf = RadiativeForcing.compute(421.0)
        assert rf.delta_T_K > 0

    def test_fields_consistent(self):
        co2 = 500.0
        rf = RadiativeForcing.compute(co2)
        assert rf.co2_ppm == co2
        assert rf.forcing_W_per_m2 == pytest.approx(co2_forcing_W_per_m2(co2), rel=1e-9)

    @pytest.mark.parametrize("co2", [300.0, 350.0, 420.0, 560.0, 800.0])
    def test_non_negative_forcing_above_preindustrial(self, co2):
        if co2 >= CO2_PREINDUSTRIAL_PPM:
            assert RadiativeForcing.compute(co2).forcing_W_per_m2 >= 0


# ---------------------------------------------------------------------------
# IceAlbedoFeedback
# ---------------------------------------------------------------------------


class TestIceAlbedoFeedback:
    def test_zero_warming_preindustrial_ice(self):
        ice = IceAlbedoFeedback.compute(0.0)
        assert ice.ice_volume_1000km3 == pytest.approx(ICE_VOLUME_REF_1000KM3, rel=1e-6)

    def test_strong_warming_reduces_ice(self):
        ice = IceAlbedoFeedback.compute(5.0)
        assert ice.ice_volume_1000km3 < ICE_VOLUME_REF_1000KM3

    def test_ice_non_negative(self):
        ice = IceAlbedoFeedback.compute(100.0)  # extreme warming
        assert ice.ice_volume_1000km3 >= 0

    def test_albedo_between_ocean_and_ice(self):
        for dT in [0.0, 1.0, 3.0, 5.0, 10.0]:
            ice = IceAlbedoFeedback.compute(dT)
            assert ALBEDO_OCEAN <= ice.surface_albedo <= ALBEDO_ICE

    def test_albedo_decreases_with_warming(self):
        ice1 = IceAlbedoFeedback.compute(0.0)
        ice2 = IceAlbedoFeedback.compute(3.0)
        assert ice2.surface_albedo <= ice1.surface_albedo

    def test_feedback_strength_negative(self):
        ice = IceAlbedoFeedback.compute(1.0)
        # Positive feedback: more warming → less ice → less albedo → more warming
        # dα/dT < 0 (negative feedback_strength means positive feedback to warming)
        assert ice.feedback_strength < 0

    def test_frozen(self):
        ice = IceAlbedoFeedback.compute(1.0)
        with pytest.raises(AttributeError):
            ice.delta_T_K = 5.0  # type: ignore[misc]

    @pytest.mark.planetary
    def test_ice_albedo_positive_feedback_contract(self):
        """Positive ice-albedo feedback: ∂α/∂T < 0 (more warming → less ice → less albedo)."""
        dT_values = [0.0, 1.0, 2.0, 3.0, 4.0, 5.0]
        albedos = [IceAlbedoFeedback.compute(dT).surface_albedo for dT in dT_values]
        # Albedo should be non-increasing with temperature
        for a1, a2 in zip(albedos, albedos[1:]):
            assert a1 >= a2 - 1e-10  # allowing floating point tolerance


# ---------------------------------------------------------------------------
# PlanetaryCouplingChain
# ---------------------------------------------------------------------------


class TestPlanetaryCouplingChain:
    def test_evaluate_returns_chain(self):
        chain = PlanetaryCouplingChain.evaluate(energy_EJ=500.0)
        assert isinstance(chain, PlanetaryCouplingChain)

    def test_crep_phase_in_range(self):
        for energy in [400.0, 500.0, 600.0]:
            chain = PlanetaryCouplingChain.evaluate(energy_EJ=energy)
            assert 0.0 <= chain.crep_phase <= 1.0

    def test_higher_energy_higher_stress(self):
        chain_low = PlanetaryCouplingChain.evaluate(energy_EJ=400.0)
        chain_high = PlanetaryCouplingChain.evaluate(energy_EJ=600.0)
        assert chain_high.crep_phase >= chain_low.crep_phase

    def test_stress_level_string(self):
        chain = PlanetaryCouplingChain.evaluate(energy_EJ=500.0)
        assert chain.stress_level in ("stable", "elevated", "critical", "extreme")

    def test_mandala_weight_default(self):
        chain = PlanetaryCouplingChain.evaluate(energy_EJ=500.0)
        assert chain.mandala_weight == pytest.approx(1.8, rel=1e-6)

    def test_co2_above_baseline(self):
        baseline = 421.0
        chain = PlanetaryCouplingChain.evaluate(energy_EJ=500.0, baseline_co2_ppm=baseline)
        assert chain.co2_ppm > baseline

    def test_forcing_object_type(self):
        chain = PlanetaryCouplingChain.evaluate(energy_EJ=500.0)
        assert isinstance(chain.forcing, RadiativeForcing)

    def test_ice_albedo_object_type(self):
        chain = PlanetaryCouplingChain.evaluate(energy_EJ=500.0)
        assert isinstance(chain.ice_albedo, IceAlbedoFeedback)

    def test_frozen(self):
        chain = PlanetaryCouplingChain.evaluate(energy_EJ=500.0)
        with pytest.raises(AttributeError):
            chain.crep_phase = 0.5  # type: ignore[misc]

    @pytest.mark.planetary
    def test_causal_chain_consistency(self):
        """The causal chain must be self-consistent: higher CO₂ → higher forcing → higher ΔT."""
        chain_low = PlanetaryCouplingChain.evaluate(energy_EJ=400.0)
        chain_high = PlanetaryCouplingChain.evaluate(energy_EJ=620.0)
        assert chain_high.co2_ppm > chain_low.co2_ppm
        assert chain_high.forcing.forcing_W_per_m2 >= chain_low.forcing.forcing_W_per_m2
        assert chain_high.forcing.delta_T_K >= chain_low.forcing.delta_T_K

    @pytest.mark.planetary
    def test_stress_level_ordering(self):
        """Higher energy → higher or equal stress level."""
        energy_levels = [400.0, 450.0, 500.0, 550.0, 600.0]
        chains = [PlanetaryCouplingChain.evaluate(energy_EJ=e) for e in energy_levels]
        phases = [c.crep_phase for c in chains]
        # Phases should be non-decreasing
        for p1, p2 in zip(phases, phases[1:]):
            assert p1 <= p2 + 1e-10
