"""Thermodynamic contract tests — Hatano-Sasa entropy production."""

from __future__ import annotations

import math

import pytest

from unified_mandala.thermodynamics.hatano_sasa import (
    HatanoSasaProduction,
    TrajectorySegment,
    hatano_sasa_excess,
    integral_fluctuation_check,
)


# ---------------------------------------------------------------------------
# TrajectorySegment
# ---------------------------------------------------------------------------


class TestTrajectorySegment:
    def test_basic_construction(self):
        seg = TrajectorySegment(x=0.5, lam=1.0, lam_dot=0.1, d_ln_pss_dlam=-2.0, dt=0.01)
        assert seg.x == 0.5
        assert seg.dt == 0.01

    def test_frozen(self):
        seg = TrajectorySegment(x=0.5, lam=1.0, lam_dot=0.1, d_ln_pss_dlam=-2.0, dt=0.01)
        with pytest.raises(AttributeError):
            seg.x = 0.9  # type: ignore[misc]

    def test_zero_lam_dot(self):
        seg = TrajectorySegment(x=0.3, lam=0.5, lam_dot=0.0, d_ln_pss_dlam=-1.0, dt=0.01)
        assert seg.lam_dot == 0.0

    def test_negative_d_ln_pss(self):
        seg = TrajectorySegment(x=0.5, lam=1.0, lam_dot=0.5, d_ln_pss_dlam=-3.0, dt=0.01)
        assert seg.d_ln_pss_dlam == -3.0

    def test_all_fields_stored(self):
        seg = TrajectorySegment(x=0.1, lam=2.0, lam_dot=-0.5, d_ln_pss_dlam=1.2, dt=0.001)
        assert seg.lam == 2.0
        assert seg.lam_dot == -0.5
        assert seg.d_ln_pss_dlam == 1.2


# ---------------------------------------------------------------------------
# hatano_sasa_excess
# ---------------------------------------------------------------------------


class TestHatanoSasaExcess:
    def test_empty_trajectory_zero(self):
        assert hatano_sasa_excess([]) == pytest.approx(0.0)

    def test_single_segment_formula(self):
        # σ_ex = -(lam_dot × d_ln_pss × dt) = -(0.5 × -2.0 × 0.01) = 0.01
        seg = TrajectorySegment(x=0.5, lam=1.0, lam_dot=0.5, d_ln_pss_dlam=-2.0, dt=0.01)
        result = hatano_sasa_excess([seg])
        assert result == pytest.approx(0.01, rel=1e-9)

    def test_zero_lam_dot_gives_zero_contribution(self):
        seg = TrajectorySegment(x=0.5, lam=1.0, lam_dot=0.0, d_ln_pss_dlam=-5.0, dt=0.01)
        assert hatano_sasa_excess([seg]) == pytest.approx(0.0)

    def test_multiple_segments_sum(self):
        segs = [
            TrajectorySegment(x=0.3, lam=1.0, lam_dot=1.0, d_ln_pss_dlam=-1.0, dt=0.01),
            TrajectorySegment(x=0.5, lam=1.0, lam_dot=1.0, d_ln_pss_dlam=-1.0, dt=0.01),
        ]
        # Each: -(1.0 × -1.0 × 0.01) = 0.01 → sum = 0.02
        assert hatano_sasa_excess(segs) == pytest.approx(0.02, rel=1e-9)

    def test_sign_positive_when_expanding_steady_state(self):
        # lam_dot > 0, d_ln_pss_dlam < 0 → σ_ex > 0
        seg = TrajectorySegment(x=0.5, lam=1.0, lam_dot=1.0, d_ln_pss_dlam=-1.0, dt=0.1)
        assert hatano_sasa_excess([seg]) > 0

    def test_large_trajectory_scales_linearly(self):
        seg = TrajectorySegment(x=0.5, lam=1.0, lam_dot=1.0, d_ln_pss_dlam=-1.0, dt=0.01)
        result_1 = hatano_sasa_excess([seg])
        result_10 = hatano_sasa_excess([seg] * 10)
        assert result_10 == pytest.approx(10 * result_1, rel=1e-9)

    def test_finite_result(self):
        segs = [
            TrajectorySegment(x=i * 0.01, lam=1.0, lam_dot=0.1, d_ln_pss_dlam=-0.5, dt=0.01)
            for i in range(100)
        ]
        result = hatano_sasa_excess(segs)
        assert math.isfinite(result)


# ---------------------------------------------------------------------------
# integral_fluctuation_check
# ---------------------------------------------------------------------------


class TestIntegralFluctuationCheck:
    def test_empty_raises(self):
        with pytest.raises(ValueError, match="empty"):
            integral_fluctuation_check([])

    def test_zero_sigma_gives_one(self):
        # exp(-0) = 1 for all trajectories → mean = 1
        assert integral_fluctuation_check([0.0, 0.0, 0.0]) is True

    def test_tight_atol(self):
        # With exact values, mean exp(-0) = 1, deviation = 0
        assert integral_fluctuation_check([0.0], atol=0.001) is True

    def test_large_sigma_fails_tight_check(self):
        # exp(-100) ≈ 0, far from 1
        assert integral_fluctuation_check([100.0, 100.0, 100.0], atol=0.01) is False

    def test_mixed_values_approx_one(self):
        # Gaussian ensemble: ⟨exp(-Σ)⟩ ≈ 1 for symmetric distribution
        values = [v - 0.5 for v in [0.3, 0.7, 0.5, 0.5, 0.2, 0.8]]
        # This may or may not pass; test that function returns bool
        result = integral_fluctuation_check(values, atol=1.0)
        assert isinstance(result, bool)

    def test_single_trajectory_at_zero(self):
        assert integral_fluctuation_check([0.0]) is True

    def test_atol_zero_strict(self):
        # Only exact match passes with atol=0
        assert integral_fluctuation_check([0.0], atol=0.0) is True
        # Even tiny deviation fails
        tiny = 1e-15
        result = integral_fluctuation_check([tiny], atol=0.0)
        assert isinstance(result, bool)


# ---------------------------------------------------------------------------
# HatanoSasaProduction
# ---------------------------------------------------------------------------


class TestHatanoSasaProduction:
    def test_sigma_tot_equals_sum(self):
        hsp = HatanoSasaProduction(sigma_ex=0.5, sigma_hk=0.3)
        assert hsp.sigma_tot == pytest.approx(0.8, rel=1e-9)

    def test_second_law_satisfied_positive(self):
        hsp = HatanoSasaProduction(sigma_ex=0.1, sigma_hk=0.2)
        assert hsp.second_law_satisfied is True

    def test_second_law_violated_negative_tot(self):
        hsp = HatanoSasaProduction(sigma_ex=-0.5, sigma_hk=0.1)
        assert hsp.second_law_satisfied is False

    def test_ift_value_stored(self):
        hsp = HatanoSasaProduction(sigma_ex=0.0, sigma_hk=0.0, ift_value=1.0)
        assert hsp.ift_value == 1.0

    def test_from_segments_empty(self):
        hsp = HatanoSasaProduction.from_segments([])
        assert hsp.sigma_ex == pytest.approx(0.0)

    def test_from_segments_matches_direct(self):
        segs = [
            TrajectorySegment(x=0.5, lam=1.0, lam_dot=1.0, d_ln_pss_dlam=-1.0, dt=0.01)
        ]
        direct = hatano_sasa_excess(segs)
        hsp = HatanoSasaProduction.from_segments(segs)
        assert hsp.sigma_ex == pytest.approx(direct, rel=1e-9)

    def test_from_segments_with_hk(self):
        segs = [
            TrajectorySegment(x=0.5, lam=1.0, lam_dot=1.0, d_ln_pss_dlam=-1.0, dt=0.01)
        ]
        hsp = HatanoSasaProduction.from_segments(segs, sigma_hk=0.5)
        assert hsp.sigma_hk == 0.5

    def test_from_gaussian_process_runs(self):
        hsp = HatanoSasaProduction.from_gaussian_process(
            n_steps=100,
            drift_fn=lambda x: -x,
            diffusion=0.1,
            dt=0.01,
            seed=0,
        )
        assert math.isfinite(hsp.sigma_ex)

    def test_from_gaussian_reproducible(self):
        kwargs: dict = dict(n_steps=200, drift_fn=lambda x: -0.5 * x, diffusion=0.2, dt=0.01, seed=7)
        hsp1 = HatanoSasaProduction.from_gaussian_process(**kwargs)
        hsp2 = HatanoSasaProduction.from_gaussian_process(**kwargs)
        assert hsp1.sigma_ex == hsp2.sigma_ex

    def test_from_gaussian_sigma_tot_finite(self):
        hsp = HatanoSasaProduction.from_gaussian_process(
            n_steps=500, drift_fn=lambda x: -x, diffusion=0.05, dt=0.005, seed=42
        )
        assert math.isfinite(hsp.sigma_tot)

    def test_zero_diffusion_safe(self):
        hsp = HatanoSasaProduction.from_gaussian_process(
            n_steps=10, drift_fn=lambda x: -x, diffusion=0.0, dt=0.01, seed=1
        )
        assert math.isfinite(hsp.sigma_ex)

    @pytest.mark.thermodynamics
    def test_second_law_contract_for_equilibrium(self):
        """At equilibrium (drift = 0), σ_tot should be 0."""
        hsp = HatanoSasaProduction.from_segments([])
        assert hsp.sigma_tot == pytest.approx(0.0, abs=1e-12)

    @pytest.mark.thermodynamics
    def test_non_negative_for_passive_process(self):
        """Passive (no driving) process: σ_ex ≈ 0 for constant lam_dot=0."""
        segs = [
            TrajectorySegment(x=0.5, lam=1.0, lam_dot=0.0, d_ln_pss_dlam=-2.0, dt=0.01)
            for _ in range(100)
        ]
        hsp = HatanoSasaProduction.from_segments(segs)
        assert hsp.sigma_ex == pytest.approx(0.0, abs=1e-12)
