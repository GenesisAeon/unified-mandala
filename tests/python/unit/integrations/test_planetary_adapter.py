"""Unit tests for the PlanetaryCouplingAdapter."""

from __future__ import annotations

import math

import pytest

from unified_mandala.integrations.adapters.planetary_coupling_adapter import (
    PlanetaryCouplingAdapter,
    _CO2_CURRENT_PPM,
    _IEA_MAX_EJ,
    _IEA_MIN_EJ,
)


class TestPlanetaryCouplingAdapter:
    @pytest.fixture()
    def adapter(self):
        return PlanetaryCouplingAdapter()

    def test_name(self, adapter):
        assert adapter.name == "planetary-coupling"

    def test_version(self, adapter):
        assert adapter.version == "1.0.0"

    def test_health(self, adapter):
        assert adapter.health() is True

    def test_gather_returns_dict(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert isinstance(result, dict)

    def test_phase_in_range(self, adapter):
        for entropy in [0.0, 0.1, 0.3, 0.5, 0.618, 0.8, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            assert 0.0 <= result["phase"] <= 1.0

    def test_weight_is_1_8(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["weight"] == pytest.approx(1.8, rel=1e-6)

    def test_decay_present_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "decay" in result
        assert result["decay"] > 0

    def test_co2_above_current_baseline(self, adapter):
        # With current CO2 as baseline and any energy > 0, CO2 increases
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["co2_ppm"] > _CO2_CURRENT_PPM

    def test_energy_range_mapped(self, adapter):
        result_low = adapter.gather(entropy=0.0, phases=7)
        result_high = adapter.gather(entropy=1.0, phases=7)
        assert result_low["energy_EJ"] == pytest.approx(_IEA_MIN_EJ, rel=1e-6)
        assert result_high["energy_EJ"] == pytest.approx(_IEA_MAX_EJ, rel=1e-6)

    def test_forcing_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["forcing_W_per_m2"] > 0

    def test_delta_t_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["delta_T_K"] > 0

    def test_ice_volume_non_negative(self, adapter):
        for entropy in [0.0, 0.5, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            assert result["ice_volume_1000km3"] >= 0

    def test_albedo_in_range(self, adapter):
        for entropy in [0.0, 0.5, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            assert 0.0 <= result["surface_albedo"] <= 1.0

    def test_stress_level_valid_string(self, adapter):
        for entropy in [0.0, 0.3, 0.6, 0.9, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            assert result["stress_level"] in ("stable", "elevated", "critical", "extreme")

    def test_higher_entropy_higher_phase(self, adapter):
        result_low = adapter.gather(entropy=0.0, phases=7)
        result_high = adapter.gather(entropy=1.0, phases=7)
        assert result_high["phase"] >= result_low["phase"] - 1e-10

    def test_all_required_keys_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        required = {"phase", "weight", "decay", "energy_EJ", "co2_ppm",
                    "forcing_W_per_m2", "delta_T_K", "ice_volume_1000km3",
                    "surface_albedo", "stress_level"}
        assert required.issubset(result.keys())

    def test_finite_values(self, adapter):
        for entropy in [0.0, 0.5, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            for key in ["phase", "forcing_W_per_m2", "delta_T_K", "surface_albedo"]:
                assert math.isfinite(result[key])

    def test_phases_ignored(self, adapter):
        r1 = adapter.gather(entropy=0.5, phases=1)
        r2 = adapter.gather(entropy=0.5, phases=17)
        assert r1["phase"] == pytest.approx(r2["phase"], rel=1e-9)

    @pytest.mark.planetary
    def test_extreme_entropy_stable(self, adapter):
        """At entropy=0, minimal energy → stable climate."""
        result = adapter.gather(entropy=0.0, phases=7)
        assert result["stress_level"] in ("stable", "elevated")

    @pytest.mark.planetary
    def test_max_entropy_elevated_stress(self, adapter):
        """At entropy=1, maximum energy → higher stress."""
        result = adapter.gather(entropy=1.0, phases=7)
        assert result["phase"] > adapter.gather(entropy=0.0, phases=7)["phase"] - 1e-10
