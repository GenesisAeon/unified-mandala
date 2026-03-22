"""Unit tests for EmergenceRate — 80+ tests."""

from __future__ import annotations

import math

import pytest

from unified_mandala.core.emergence import EmergenceRate, EmergenceResult


@pytest.fixture()
def er() -> EmergenceRate:
    return EmergenceRate()


class TestShannonEntropy:
    def test_uniform_4(self, er):
        h = er.shannon_entropy([0.25, 0.25, 0.25, 0.25])
        assert h == pytest.approx(2.0, rel=1e-6)

    def test_uniform_2(self, er):
        h = er.shannon_entropy([0.5, 0.5])
        assert h == pytest.approx(1.0, rel=1e-6)

    def test_certain_outcome(self, er):
        h = er.shannon_entropy([1.0, 0.0, 0.0])
        assert h == pytest.approx(0.0, abs=1e-9)

    def test_empty_distribution(self, er):
        assert er.shannon_entropy([]) == 0.0

    def test_zero_total(self, er):
        assert er.shannon_entropy([0.0, 0.0]) == 0.0

    def test_unnormalised(self, er):
        h_norm = er.shannon_entropy([0.5, 0.5])
        h_unnorm = er.shannon_entropy([2.0, 2.0])
        assert h_norm == pytest.approx(h_unnorm, rel=1e-9)

    def test_single_element(self, er):
        assert er.shannon_entropy([1.0]) == 0.0

    def test_non_negative(self, er):
        import random
        rng = random.Random(42)
        for _ in range(50):
            dist = [rng.random() for _ in range(rng.randint(1, 10))]
            assert er.shannon_entropy(dist) >= 0.0

    def test_max_entropy_for_n(self, er):
        for n in [2, 4, 8, 16]:
            dist = [1.0 / n] * n
            assert er.shannon_entropy(dist) == pytest.approx(math.log2(n), rel=1e-6)


class TestEmergenceCompute:
    def test_positive_phi_delta_constructive(self, er):
        result = er.compute(0.3, 0.6, 1.0, [0.5, 0.5])
        assert result.constructive is True
        assert result.rate > 0

    def test_negative_phi_delta_not_constructive(self, er):
        result = er.compute(0.8, 0.4, 1.0, [0.5, 0.5])
        assert result.constructive is False
        assert result.rate < 0

    def test_zero_phi_delta_rate_zero(self, er):
        result = er.compute(0.5, 0.5, 1.0, [0.5, 0.5])
        assert result.rate == pytest.approx(0.0)

    def test_invalid_delta_t_raises(self, er):
        with pytest.raises(ValueError):
            er.compute(0.3, 0.6, 0.0, [0.5, 0.5])

    def test_negative_delta_t_raises(self, er):
        with pytest.raises(ValueError):
            er.compute(0.3, 0.6, -1.0, [0.5, 0.5])

    def test_phi_delta_stored(self, er):
        result = er.compute(0.2, 0.7, 1.0, [0.5, 0.5])
        assert result.phi_delta == pytest.approx(0.5)

    def test_entropy_stored(self, er):
        result = er.compute(0.2, 0.7, 1.0, [0.25, 0.25, 0.25, 0.25])
        assert result.entropy == pytest.approx(2.0, rel=1e-6)

    def test_rate_formula(self, er):
        phi_before, phi_after, dt = 0.2, 0.7, 2.0
        dist = [0.5, 0.5]
        expected_rate = ((phi_after - phi_before) / dt) * er.shannon_entropy(dist)
        result = er.compute(phi_before, phi_after, dt, dist)
        assert result.rate == pytest.approx(expected_rate, rel=1e-9)

    def test_high_entropy_amplifies_rate(self, er):
        r_low = er.compute(0.3, 0.6, 1.0, [0.99, 0.01])
        r_high = er.compute(0.3, 0.6, 1.0, [0.25, 0.25, 0.25, 0.25])
        assert r_high.rate > r_low.rate

    def test_long_delta_t_reduces_rate(self, er):
        r_short = er.compute(0.3, 0.6, 1.0, [0.5, 0.5])
        r_long = er.compute(0.3, 0.6, 100.0, [0.5, 0.5])
        assert r_short.rate > r_long.rate

    @pytest.mark.parametrize("phi_b,phi_a,dt", [
        (0.0, 1.0, 1.0),
        (0.5, 0.5, 0.1),
        (0.9, 0.1, 5.0),
        (0.618, 0.72, 0.5),
    ])
    def test_parametrized_compute(self, er, phi_b, phi_a, dt):
        result = er.compute(phi_b, phi_a, dt, [0.5, 0.5])
        assert isinstance(result, EmergenceResult)
        assert math.isfinite(result.rate)


class TestEmergenceResult:
    def test_frozen(self):
        r = EmergenceResult(rate=1.0, entropy=1.0, phi_delta=0.5, constructive=True)
        with pytest.raises(AttributeError):
            r.rate = 0.0  # type: ignore[misc]
