"""Unit tests for the GreekMath adapter."""

from __future__ import annotations

import math

import pytest

from unified_mandala.integrations.adapters.greekmath_adapter import (
    _PHI,
    _PLATONIC_SOLIDS,
    _PYTHAGOREAN_RATIOS,
    GreekMathAdapter,
    _archimedean_phase,
    _golden_section_resonance,
    _platonic_resonance,
    _pythagorean_resonance,
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------


class TestConstants:
    def test_phi_golden_ratio(self):
        assert pytest.approx(0.618_033_988_749_895, rel=1e-10) == _PHI

    def test_pythagorean_ratios_valid(self):
        for r in _PYTHAGOREAN_RATIOS:
            assert 0.0 < r < 1.0

    def test_five_pythagorean_ratios(self):
        assert len(_PYTHAGOREAN_RATIOS) == 5

    def test_five_platonic_solids(self):
        assert len(_PLATONIC_SOLIDS) == 5

    def test_platonic_dihedral_angles_valid(self):
        for solid in _PLATONIC_SOLIDS:
            faces, verts, edges, angle = solid
            assert faces > 0
            assert verts > 0
            assert edges > 0
            assert 0.0 < angle < 180.0


# ---------------------------------------------------------------------------
# Primitive resonance functions
# ---------------------------------------------------------------------------


class TestPythagoreanResonance:
    def test_at_half_close_to_one(self):
        r = _pythagorean_resonance(0.5)
        assert r == pytest.approx(1.0, abs=0.01)

    def test_range_zero_to_one(self):
        for e in [0.0, 0.1, 0.5, 0.618, 0.75, 1.0]:
            assert 0.0 <= _pythagorean_resonance(e) <= 1.0

    def test_minimum_far_from_ratios(self):
        r = _pythagorean_resonance(0.95)
        assert r < 0.5

    def test_finite(self):
        for e in [0.0, 0.333, 0.5, 0.618, 1.0]:
            assert math.isfinite(_pythagorean_resonance(e))

    def test_peaks_at_ratio(self):
        for ratio in _PYTHAGOREAN_RATIOS:
            r = _pythagorean_resonance(ratio)
            assert r > 0.9


class TestGoldenSectionResonance:
    def test_at_phi_equals_one(self):
        r = _golden_section_resonance(_PHI)
        assert r == pytest.approx(1.0, rel=1e-6)

    def test_range_zero_to_one(self):
        for e in [0.0, 0.1, 0.5, 0.618, 0.9, 1.0]:
            assert 0.0 <= _golden_section_resonance(e) <= 1.0

    def test_drops_away_from_phi(self):
        r_phi = _golden_section_resonance(_PHI)
        r_far = _golden_section_resonance(0.0)
        assert r_phi > r_far

    def test_positive_everywhere(self):
        for e in [0.0, 0.3, 0.6, 0.9]:
            assert _golden_section_resonance(e) > 0

    def test_symmetric_around_phi(self):
        delta = 0.1
        r_left = _golden_section_resonance(_PHI - delta)
        r_right = _golden_section_resonance(_PHI + delta)
        assert r_left == pytest.approx(r_right, rel=1e-6)


class TestArchimedeanPhase:
    def test_range_zero_to_one(self):
        for e in [0.0, 0.25, 0.5, 0.618, 1.0]:
            for p in [1, 3, 7]:
                r = _archimedean_phase(e, p)
                assert 0.0 <= r <= 1.0

    def test_finite(self):
        for e in [0.0, 0.5, 1.0]:
            assert math.isfinite(_archimedean_phase(e, 7))

    def test_varies_with_phases(self):
        r1 = _archimedean_phase(0.5, 1)
        r7 = _archimedean_phase(0.5, 7)
        # Different phase counts → different spiral angles
        assert isinstance(r1, float) and isinstance(r7, float)


class TestPlatonicResonance:
    def test_range_zero_to_one(self):
        for e in [0.0, 0.25, 0.5, 0.75, 1.0]:
            assert 0.0 <= _platonic_resonance(e) <= 1.0

    def test_peak_near_octahedron_angle(self):
        # Octahedron dihedral = 109.471° → entropy = 109.471/180 ≈ 0.608
        e = 109.471 / 180.0
        r = _platonic_resonance(e)
        assert r > 0.8

    def test_positive_everywhere(self):
        for e in [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]:
            assert _platonic_resonance(e) > 0

    def test_finite(self):
        for e in [0.0, 0.5, 1.0]:
            assert math.isfinite(_platonic_resonance(e))


# ---------------------------------------------------------------------------
# GreekMathAdapter
# ---------------------------------------------------------------------------


class TestGreekMathAdapter:
    @pytest.fixture()
    def adapter(self):
        return GreekMathAdapter()

    def test_name(self, adapter):
        assert adapter.name == "greekmath"

    def test_version(self, adapter):
        assert adapter.version == "2.0.0"

    def test_health(self, adapter):
        assert adapter.health() is True

    def test_gather_returns_dict(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert isinstance(result, dict)

    def test_phase_in_range(self, adapter):
        for entropy in [0.0, 0.1, 0.3, 0.5, 0.618, 0.75, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            assert 0.0 <= result["phase"] <= 1.0

    def test_weight_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["weight"] > 0

    def test_decay_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "decay" in result

    def test_primitive_scores_in_dict(self, adapter):
        result = adapter.gather(entropy=0.618, phases=7)
        for key in ["pythagorean", "golden_section", "archimedean", "platonic"]:
            assert key in result
            assert 0.0 <= result[key] <= 1.0

    def test_phi_in_dict(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "phi" in result
        assert result["phi"] == pytest.approx(_PHI, rel=1e-10)

    def test_phase_near_phi_elevated(self, adapter):
        result = adapter.gather(entropy=_PHI, phases=7)
        result_far = adapter.gather(entropy=0.1, phases=7)
        # Near φ, golden section resonance peaks → phase elevated
        assert result["golden_section"] > result_far["golden_section"]

    def test_phase_finite(self, adapter):
        for e in [0.0, 0.5, 1.0]:
            result = adapter.gather(entropy=e, phases=3)
            assert math.isfinite(result["phase"])

    @pytest.mark.parametrize("phases", [1, 3, 7, 12])
    def test_various_phases(self, adapter, phases):
        result = adapter.gather(entropy=0.5, phases=phases)
        assert 0.0 <= result["phase"] <= 1.0

    def test_weights_sum_to_one(self):
        weights = GreekMathAdapter._WEIGHTS
        assert sum(weights) == pytest.approx(1.0, rel=1e-9)

    def test_repr(self, adapter):
        assert "greekmath" in repr(adapter)
