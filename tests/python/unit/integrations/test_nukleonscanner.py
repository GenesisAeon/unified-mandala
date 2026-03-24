"""Unit tests for the NukleonScanner adapter."""

from __future__ import annotations

import math

import pytest

from unified_mandala.integrations.adapters.nukleonscanner_adapter import (
    NukleonScannerAdapter,
    _LAMBDA_QCD_GEV,
    _T_CONFINEMENT_GEV,
    _alpha_strong,
)


# ---------------------------------------------------------------------------
# _alpha_strong
# ---------------------------------------------------------------------------


class TestAlphaStrong:
    def test_positive_at_1gev(self):
        assert _alpha_strong(1.0) > 0

    def test_decreases_with_energy(self):
        a1 = _alpha_strong(1.0)
        a10 = _alpha_strong(10.0)
        assert a10 < a1  # asymptotic freedom

    def test_finite(self):
        for q in [0.22, 0.5, 1.0, 5.0, 10.0]:
            assert math.isfinite(_alpha_strong(q))

    def test_near_pole_clamped(self):
        # Should not blow up at Q = Lambda_QCD
        a = _alpha_strong(_LAMBDA_QCD_GEV)
        assert math.isfinite(a)

    def test_mz_scale_approx(self):
        # At Q = M_Z ≈ 91.2 GeV, αs ≈ 0.118 (PDG)
        a_mz = _alpha_strong(91.2)
        assert 0.05 < a_mz < 0.25  # broad sanity range for 1-loop

    def test_positive_always(self):
        for q in [0.22, 1.0, 5.0, 50.0]:
            assert _alpha_strong(q) > 0


# ---------------------------------------------------------------------------
# NukleonScannerAdapter
# ---------------------------------------------------------------------------


class TestNukleonScannerAdapter:
    @pytest.fixture()
    def adapter(self):
        return NukleonScannerAdapter()

    def test_name(self, adapter):
        assert adapter.name == "nukleonscanner"

    def test_version(self, adapter):
        assert adapter.version == "2.0.0"

    def test_health(self, adapter):
        assert adapter.health() is True

    def test_gather_returns_dict(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert isinstance(result, dict)

    def test_phase_in_range(self, adapter):
        for entropy in [0.0, 0.1, 0.3, 0.5, 0.618, 0.8, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            assert 0.0 <= result["phase"] <= 1.0

    def test_weight_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["weight"] > 0

    def test_decay_present_and_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "decay" in result
        assert result["decay"] >= 0

    def test_alpha_s_present(self, adapter):
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
            assert 0.0 <= result["qgp_proximity"] <= 1.0

    def test_n_flavors_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=3)
        assert result["n_flavors"] == 3

    def test_lambda_qcd_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=3)
        assert result["lambda_qcd_gev"] == pytest.approx(_LAMBDA_QCD_GEV, rel=1e-6)

    def test_confinement_proximity_near_tc(self, adapter):
        # At entropy → T_c/10 GeV range, proximity should peak
        tc_entropy = (_T_CONFINEMENT_GEV - _LAMBDA_QCD_GEV) / (10.0 - _LAMBDA_QCD_GEV)
        result = adapter.gather(entropy=tc_entropy, phases=1)
        assert result["qgp_proximity"] > 0.5

    def test_phase_finite(self, adapter):
        for entropy in [0.0, 0.25, 0.5, 0.75, 1.0]:
            result = adapter.gather(entropy=entropy, phases=5)
            assert math.isfinite(result["phase"])

    @pytest.mark.parametrize("phases", [1, 3, 7, 12, 17])
    def test_different_phases(self, adapter, phases):
        result = adapter.gather(entropy=0.5, phases=phases)
        assert 0.0 <= result["phase"] <= 1.0

    def test_repr(self, adapter):
        assert "nukleonscanner" in repr(adapter)
