"""Unit and contract tests for the NukleonScanner adapter v2.1.0."""

from __future__ import annotations

import math

import pytest

from unified_mandala.integrations.adapters.nukleonscanner_adapter import (
    _BETA0,
    _BETA1,
    _LAMBDA_QCD_GEV,
    _N_FLAVORS,
    _SIGMA_STRING_GEV2,
    _T_CONFINEMENT_GEV,
    _W_QGP,
    _W_STRING,
    NukleonScannerAdapter,
    _alpha_strong,
    _qgp_proximity,
    _string_tension_phase,
)

# ── Constants ──────────────────────────────────────────────────────────────────


class TestConstants:
    def test_lambda_qcd_value(self):
        assert pytest.approx(0.217, rel=1e-6) == _LAMBDA_QCD_GEV

    def test_t_confinement_value(self):
        assert pytest.approx(0.155, rel=1e-6) == _T_CONFINEMENT_GEV

    def test_n_flavors(self):
        assert _N_FLAVORS == 3

    def test_beta0_formula(self):
        expected = 11.0 - (2.0 * 3) / 3.0
        assert pytest.approx(expected, rel=1e-9) == _BETA0

    def test_beta1_formula(self):
        expected = 102.0 - (38.0 * 3) / 3.0
        assert pytest.approx(expected, rel=1e-9) == _BETA1

    def test_sigma_string_positive(self):
        assert _SIGMA_STRING_GEV2 > 0

    def test_weights_sum_to_one(self):
        assert pytest.approx(1.0, rel=1e-9) == _W_QGP + _W_STRING


# ── _alpha_strong (two-loop) ───────────────────────────────────────────────────


class TestAlphaStrong:
    def test_positive_at_1gev(self):
        assert _alpha_strong(1.0) > 0

    def test_asymptotic_freedom(self):
        """αs decreases as Q increases (asymptotic freedom)."""
        a1 = _alpha_strong(1.0)
        a10 = _alpha_strong(10.0)
        assert a10 < a1

    def test_finite_at_all_scales(self):
        for q in [0.22, 0.5, 1.0, 5.0, 10.0, 91.2]:
            assert math.isfinite(_alpha_strong(q))

    def test_near_pole_clamped(self):
        """Must not blow up at Q ≈ Λ_QCD."""
        a = _alpha_strong(_LAMBDA_QCD_GEV)
        assert math.isfinite(a)

    def test_mz_scale_sanity(self):
        """At Q = M_Z ≈ 91.2 GeV, αs ≈ 0.118 (PDG 2022)."""
        a_mz = _alpha_strong(91.2)
        assert 0.05 < a_mz < 0.25

    def test_positive_always(self):
        for q in [0.22, 1.0, 5.0, 50.0]:
            assert _alpha_strong(q) >= 0

    def test_two_loop_finite_at_high_q(self):
        """Two-loop result stays finite and physical at high Q."""
        two_loop = _alpha_strong(10.0)
        assert math.isfinite(two_loop)
        assert 0.0 < two_loop < 1.0


# ── _string_tension_phase ──────────────────────────────────────────────────────


class TestStringTensionPhase:
    def test_range_zero_to_one(self):
        for q in [0.1, 0.5, 1.0, 5.0, 10.0]:
            p = _string_tension_phase(q)
            assert 0.0 <= p <= 1.0

    def test_increases_with_energy(self):
        """At high Q (deconfinement), string phase → 1."""
        p_low = _string_tension_phase(0.2)
        p_high = _string_tension_phase(5.0)
        assert p_high > p_low

    def test_approaches_one_at_high_q(self):
        p = _string_tension_phase(100.0)
        assert p > 0.999

    def test_approaches_zero_at_low_q(self):
        p = _string_tension_phase(0.05)
        assert p < 0.2

    def test_finite_always(self):
        for q in [0.01, 0.1, 1.0, 10.0]:
            assert math.isfinite(_string_tension_phase(q))


# ── _qgp_proximity ────────────────────────────────────────────────────────────


class TestQGPProximity:
    def test_peaks_at_tc(self):
        gamma = 1.0
        p_at_tc = _qgp_proximity(_T_CONFINEMENT_GEV, gamma)
        p_far = _qgp_proximity(5.0, gamma)
        assert p_at_tc > p_far

    def test_range_zero_to_one(self):
        for q, g in [(0.155, 1.0), (1.0, 2.0), (0.5, 5.0)]:
            p = _qgp_proximity(q, g)
            assert 0.0 < p <= 1.0

    def test_equals_one_at_tc(self):
        p = _qgp_proximity(_T_CONFINEMENT_GEV, 2.0)
        assert pytest.approx(1.0, rel=1e-9) == p

    def test_increases_damping_with_gamma(self):
        q = 1.0
        p_low_g = _qgp_proximity(q, 0.5)
        p_high_g = _qgp_proximity(q, 5.0)
        assert p_high_g < p_low_g


# ── NukleonScannerAdapter ─────────────────────────────────────────────────────


class TestNukleonScannerAdapter:
    @pytest.fixture()
    def adapter(self):
        return NukleonScannerAdapter()

    def test_name(self, adapter):
        assert adapter.name == "nukleonscanner"

    def test_version(self, adapter):
        assert adapter.version == "2.1.0"

    def test_health(self, adapter):
        assert adapter.health() is True

    def test_repr(self, adapter):
        assert "nukleonscanner" in repr(adapter)

    def test_gather_returns_dict(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert isinstance(result, dict)

    def test_phase_in_range(self, adapter):
        for entropy in [0.0, 0.1, 0.3, 0.5, 0.618, 0.8, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            assert 0.0 <= result["phase"] <= 1.0

    def test_phase_finite(self, adapter):
        for entropy in [0.0, 0.25, 0.5, 0.75, 1.0]:
            result = adapter.gather(entropy=entropy, phases=5)
            assert math.isfinite(result["phase"])

    def test_weight_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["weight"] > 0

    def test_decay_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["decay"] >= 0

    def test_alpha_s_present_and_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "alpha_s" in result
        assert result["alpha_s"] > 0

    def test_q_gev_range(self, adapter):
        for entropy in [0.0, 0.5, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            assert result["q_gev"] >= _LAMBDA_QCD_GEV

    def test_qgp_proximity_range(self, adapter):
        for entropy in [0.0, 0.5, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            assert 0.0 < result["qgp_proximity"] <= 1.0

    def test_string_phase_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "string_phase" in result
        assert 0.0 <= result["string_phase"] <= 1.0

    def test_string_phase_increases_with_entropy(self, adapter):
        """Higher entropy → higher Q → closer to deconfinement → higher string phase."""
        r_low = adapter.gather(entropy=0.1, phases=7)
        r_high = adapter.gather(entropy=0.9, phases=7)
        assert r_high["string_phase"] > r_low["string_phase"]

    def test_n_flavors_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=3)
        assert result["n_flavors"] == 3

    def test_lambda_qcd_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=3)
        assert result["lambda_qcd_gev"] == pytest.approx(_LAMBDA_QCD_GEV, rel=1e-6)

    def test_sigma_string_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=3)
        assert result["sigma_string_gev2"] == pytest.approx(_SIGMA_STRING_GEV2, rel=1e-6)

    def test_confinement_proximity_near_tc(self, adapter):
        tc_entropy = (_T_CONFINEMENT_GEV - _LAMBDA_QCD_GEV) / (10.0 - _LAMBDA_QCD_GEV)
        result = adapter.gather(entropy=tc_entropy, phases=1)
        assert result["qgp_proximity"] > 0.5

    @pytest.mark.parametrize("phases", [1, 3, 7, 12, 17])
    def test_different_phases(self, adapter, phases):
        result = adapter.gather(entropy=0.5, phases=phases)
        assert 0.0 <= result["phase"] <= 1.0

    def test_all_required_keys_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        required = {
            "phase",
            "weight",
            "decay",
            "alpha_s",
            "q_gev",
            "qgp_proximity",
            "string_phase",
            "n_flavors",
            "lambda_qcd_gev",
            "sigma_string_gev2",
        }
        assert required.issubset(result.keys())


# ── Contract tests ────────────────────────────────────────────────────────────


@pytest.mark.integration
class TestNukleonScannerContract:
    """Contract tests: NukleonScanner must satisfy the CREP adapter interface."""

    @pytest.fixture(scope="class")
    def adapter(self):
        return NukleonScannerAdapter()

    def test_phase_monotone_string_with_entropy(self, adapter):
        """String phase must increase with entropy (higher Q = deconfinement)."""
        vals = [adapter.gather(entropy=e, phases=7)["string_phase"] for e in [0.1, 0.5, 0.9]]
        assert vals[0] < vals[1] < vals[2]

    def test_alpha_s_asymptotic_freedom(self, adapter):
        """αs must decrease with entropy (= higher Q)."""
        a_low = adapter.gather(entropy=0.1, phases=7)["alpha_s"]
        a_high = adapter.gather(entropy=0.9, phases=7)["alpha_s"]
        assert a_high < a_low

    def test_phase_is_weighted_combination(self, adapter):
        """phase = W_QGP · min(αs,1) · φ_QGP + W_STRING · φ_string."""
        result = adapter.gather(entropy=0.5, phases=7)
        qgp_ch = min(1.0, result["alpha_s"]) * result["qgp_proximity"]
        str_ch = result["string_phase"]
        expected = _W_QGP * qgp_ch + _W_STRING * str_ch
        assert result["phase"] == pytest.approx(expected, abs=1e-9)

    def test_health_always_true(self, adapter):
        assert adapter.health() is True

    def test_gather_stable_on_boundary(self, adapter):
        """Boundary entropy values must not raise and return finite phase."""
        for e in [0.0, 1.0]:
            r = adapter.gather(entropy=e, phases=1)
            assert math.isfinite(r["phase"])
