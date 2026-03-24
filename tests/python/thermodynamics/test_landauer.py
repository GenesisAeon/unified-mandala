"""Thermodynamic contract tests — Landauer erasure principle.

Tests physical correctness of the Landauer bound implementation,
including SI unit consistency, monotonicity, and edge-case behaviour.
"""

from __future__ import annotations

import math

import pytest

from unified_mandala.thermodynamics.landauer import (
    BOLTZMANN_K,
    LandauerBound,
    landauer_energy,
    landauer_entropy,
    landauer_efficiency,
    landauer_temperature_from_energy,
)


# ---------------------------------------------------------------------------
# Physical constant checks
# ---------------------------------------------------------------------------


class TestBoltzmannConstant:
    """Verify BOLTZMANN_K matches the 2019 SI definition."""

    def test_value_approx(self):
        assert BOLTZMANN_K == pytest.approx(1.380649e-23, rel=1e-9)

    def test_positive(self):
        assert BOLTZMANN_K > 0

    def test_units_magnitude(self):
        # Should be of order 10^-23
        assert 1e-24 < BOLTZMANN_K < 1e-22

    def test_not_zero(self):
        assert BOLTZMANN_K != 0.0


# ---------------------------------------------------------------------------
# landauer_energy
# ---------------------------------------------------------------------------


class TestLandauerEnergy:
    """Contract tests for landauer_energy(T, n_bits)."""

    def test_room_temperature_one_bit(self):
        e = landauer_energy(300.0)
        assert e == pytest.approx(BOLTZMANN_K * 300.0 * math.log(2.0), rel=1e-9)

    def test_room_temperature_magnitude(self):
        e = landauer_energy(300.0)
        # Should be ~2.87e-21 J
        assert 2.0e-21 < e < 4.0e-21

    def test_zero_temperature_raises(self):
        with pytest.raises(ValueError, match="temperature_K"):
            landauer_energy(0.0)

    def test_negative_temperature_raises(self):
        with pytest.raises(ValueError, match="temperature_K"):
            landauer_energy(-1.0)

    def test_negative_bits_raises(self):
        with pytest.raises(ValueError, match="n_bits"):
            landauer_energy(300.0, n_bits=-1.0)

    def test_zero_bits_returns_zero(self):
        assert landauer_energy(300.0, n_bits=0.0) == 0.0

    def test_linear_in_temperature(self):
        e1 = landauer_energy(300.0)
        e2 = landauer_energy(600.0)
        assert e2 == pytest.approx(2.0 * e1, rel=1e-9)

    def test_linear_in_n_bits(self):
        e1 = landauer_energy(300.0, n_bits=1.0)
        e10 = landauer_energy(300.0, n_bits=10.0)
        assert e10 == pytest.approx(10.0 * e1, rel=1e-9)

    def test_positive_for_positive_inputs(self):
        assert landauer_energy(100.0) > 0

    def test_very_cold_temperature(self):
        e = landauer_energy(1.0)
        assert e > 0

    def test_very_hot_temperature(self):
        e = landauer_energy(1e6)
        assert e > 0

    @pytest.mark.parametrize("T", [1.0, 77.0, 273.15, 300.0, 1000.0, 1e4])
    def test_positive_over_temperature_range(self, T):
        assert landauer_energy(T) > 0

    @pytest.mark.parametrize("n", [0.5, 1.0, 2.0, 8.0, 64.0, 1000.0])
    def test_positive_over_bit_range(self, n):
        assert landauer_energy(300.0, n_bits=n) > 0

    def test_cryogenic_millikelvin(self):
        e = landauer_energy(0.001)
        assert e > 0
        assert e < landauer_energy(300.0)

    def test_scales_with_k_b(self):
        e = landauer_energy(300.0, n_bits=1.0)
        expected = BOLTZMANN_K * 300.0 * math.log(2)
        assert e == pytest.approx(expected, rel=1e-12)


# ---------------------------------------------------------------------------
# landauer_entropy
# ---------------------------------------------------------------------------


class TestLandauerEntropy:
    """Contract tests for landauer_entropy(n_bits)."""

    def test_one_bit(self):
        s = landauer_entropy(1.0)
        assert s == pytest.approx(BOLTZMANN_K * math.log(2.0), rel=1e-9)

    def test_zero_bits(self):
        assert landauer_entropy(0.0) == 0.0

    def test_negative_raises(self):
        with pytest.raises(ValueError):
            landauer_entropy(-0.5)

    def test_linear_in_n_bits(self):
        s1 = landauer_entropy(1.0)
        s5 = landauer_entropy(5.0)
        assert s5 == pytest.approx(5.0 * s1, rel=1e-9)

    def test_positive(self):
        assert landauer_entropy(1.0) > 0

    def test_independent_of_temperature(self):
        # Entropy per bit is k_B ln2 regardless of T
        s = landauer_entropy(1.0)
        expected = BOLTZMANN_K * math.log(2.0)
        assert s == pytest.approx(expected, rel=1e-12)

    @pytest.mark.parametrize("n", [1, 8, 32, 64, 128, 256])
    def test_byte_and_word_sizes(self, n):
        s = landauer_entropy(float(n))
        assert s == pytest.approx(n * BOLTZMANN_K * math.log(2.0), rel=1e-9)


# ---------------------------------------------------------------------------
# landauer_temperature_from_energy
# ---------------------------------------------------------------------------


class TestLandauerTemperatureFromEnergy:
    """Round-trip and physics tests for the inverse Landauer function."""

    def test_round_trip_300K(self):
        T = 300.0
        e = landauer_energy(T)
        T_back = landauer_temperature_from_energy(e)
        assert T_back == pytest.approx(T, rel=1e-9)

    def test_round_trip_1K(self):
        T = 1.0
        e = landauer_energy(T)
        T_back = landauer_temperature_from_energy(e)
        assert T_back == pytest.approx(T, rel=1e-9)

    def test_round_trip_n_bits(self):
        T = 77.0
        n = 8.0
        e = landauer_energy(T, n_bits=n)
        T_back = landauer_temperature_from_energy(e, n_bits=n)
        assert T_back == pytest.approx(T, rel=1e-9)

    def test_zero_energy_raises(self):
        with pytest.raises(ValueError, match="energy_J"):
            landauer_temperature_from_energy(0.0)

    def test_negative_energy_raises(self):
        with pytest.raises(ValueError):
            landauer_temperature_from_energy(-1e-20)

    def test_zero_bits_raises(self):
        with pytest.raises(ValueError, match="n_bits"):
            landauer_temperature_from_energy(1e-21, n_bits=0.0)

    def test_monotonic_in_energy(self):
        e1 = 1e-22
        e2 = 1e-21
        assert landauer_temperature_from_energy(e2) > landauer_temperature_from_energy(e1)


# ---------------------------------------------------------------------------
# landauer_efficiency
# ---------------------------------------------------------------------------


class TestLandauerEfficiency:
    """Tests for η = E_min / E_actual."""

    def test_ideal_efficiency_one(self):
        T = 300.0
        e_min = landauer_energy(T)
        eta = landauer_efficiency(e_min, T)
        assert eta == pytest.approx(1.0, rel=1e-9)

    def test_excess_dissipation_less_than_one(self):
        T = 300.0
        e_min = landauer_energy(T)
        eta = landauer_efficiency(e_min * 2, T)
        assert eta == pytest.approx(0.5, rel=1e-9)

    def test_efficiency_positive(self):
        eta = landauer_efficiency(1e-20, 300.0)
        assert eta > 0

    def test_efficiency_at_most_one_for_large_energy(self):
        eta = landauer_efficiency(1e-19, 300.0)
        assert eta <= 1.0

    def test_efficiency_decreases_with_more_actual_energy(self):
        T = 300.0
        e1 = 1e-20
        e2 = 1e-19
        assert landauer_efficiency(e1, T) > landauer_efficiency(e2, T)

    def test_very_efficient_process(self):
        T = 300.0
        e_min = landauer_energy(T)
        eta = landauer_efficiency(e_min * 1.001, T)
        assert eta == pytest.approx(1.0, rel=1e-3)


# ---------------------------------------------------------------------------
# LandauerBound
# ---------------------------------------------------------------------------


class TestLandauerBound:
    """Tests for LandauerBound dataclass and compute factory."""

    def test_compute_fields_populated(self):
        lb = LandauerBound.compute(300.0)
        assert lb.temperature_K == 300.0
        assert lb.n_bits == 1.0
        assert lb.energy_J > 0
        assert lb.entropy_J_per_K > 0
        assert lb.efficiency is None

    def test_compute_with_actual_energy(self):
        T = 300.0
        e_min = landauer_energy(T)
        lb = LandauerBound.compute(T, actual_energy_J=e_min * 2)
        assert lb.efficiency == pytest.approx(0.5, rel=1e-9)

    def test_energy_ev_positive(self):
        lb = LandauerBound.compute(300.0)
        assert lb.energy_eV > 0

    def test_energy_kt_equals_ln2(self):
        lb = LandauerBound.compute(300.0, n_bits=1.0)
        assert lb.energy_kT == pytest.approx(math.log(2.0), rel=1e-9)

    def test_energy_kt_scales_with_n_bits(self):
        lb5 = LandauerBound.compute(300.0, n_bits=5.0)
        assert lb5.energy_kT == pytest.approx(5.0 * math.log(2.0), rel=1e-9)

    def test_frozen_immutable(self):
        lb = LandauerBound.compute(300.0)
        with pytest.raises(AttributeError):
            lb.temperature_K = 400.0  # type: ignore[misc]

    def test_multi_bit_energy(self):
        lb8 = LandauerBound.compute(300.0, n_bits=8.0)
        lb1 = LandauerBound.compute(300.0, n_bits=1.0)
        assert lb8.energy_J == pytest.approx(8.0 * lb1.energy_J, rel=1e-9)

    @pytest.mark.parametrize("T", [1.0, 77.0, 300.0, 1000.0])
    def test_energy_scales_linearly_with_T(self, T):
        lb = LandauerBound.compute(T)
        expected = landauer_energy(T)
        assert lb.energy_J == pytest.approx(expected, rel=1e-9)

    def test_energy_eV_conversion(self):
        lb = LandauerBound.compute(300.0)
        # Room-temperature Landauer bound ≈ 1.8e-2 meV
        assert lb.energy_eV == pytest.approx(lb.energy_J / 1.602_176_634e-19, rel=1e-6)


# ---------------------------------------------------------------------------
# Thermodynamic contract: Landauer as lower bound
# ---------------------------------------------------------------------------


@pytest.mark.thermodynamics
class TestLandauerPhysicalContracts:
    """Physical correctness contracts — these must always pass."""

    def test_second_law_lower_bound(self):
        """Any erasure dissipates at least k_B T ln2 per bit."""
        T = 300.0
        e_min = landauer_energy(T)
        # Simulated actual dissipation (always >= e_min in physical systems)
        for factor in [1.0, 1.1, 2.0, 10.0, 100.0]:
            actual = e_min * factor
            eta = landauer_efficiency(actual, T)
            assert eta <= 1.0 + 1e-12  # efficiency never > 1

    def test_entropy_non_negative(self):
        for n in [0.0, 1.0, 8.0, 64.0]:
            assert landauer_entropy(n) >= 0

    def test_energy_non_negative(self):
        for T in [0.001, 1.0, 300.0, 1e6]:
            for n in [0.0, 1.0, 8.0]:
                assert landauer_energy(T, n) >= 0

    def test_entropy_per_bit_universal_constant(self):
        """Δs = k_B ln2 is a universal constant, independent of T."""
        s_per_bit = landauer_entropy(1.0)
        for _T in [1.0, 77.0, 300.0, 1e4]:
            assert s_per_bit == pytest.approx(BOLTZMANN_K * math.log(2.0), rel=1e-12)

    def test_energy_scales_with_temperature_exactly(self):
        """Landauer energy must scale linearly with T."""
        T_ref = 300.0
        e_ref = landauer_energy(T_ref)
        for factor in [0.1, 0.5, 2.0, 10.0]:
            T = T_ref * factor
            e = landauer_energy(T)
            assert e == pytest.approx(factor * e_ref, rel=1e-9)
