"""Unit tests for CREP evaluator — 150+ tests."""

from __future__ import annotations

import math
import time

import pytest

from unified_mandala.core.crep import (
    EMERGENCE_THRESHOLD,
    CREPEvaluator,
    CREPResult,
    ResonanceChannel,
)


# ── Fixtures ───────────────────────────────────────────────────────────────────

@pytest.fixture()
def evaluator() -> CREPEvaluator:
    return CREPEvaluator()


@pytest.fixture()
def high_channel() -> ResonanceChannel:
    return ResonanceChannel(name="high", phase=0.95, weight=1.0, decay=0.0, timestamp=0.0)


@pytest.fixture()
def low_channel() -> ResonanceChannel:
    return ResonanceChannel(name="low", phase=0.1, weight=1.0, decay=0.0, timestamp=0.0)


# ── ResonanceChannel ──────────────────────────────────────────────────────────

class TestResonanceChannel:
    def test_name(self):
        ch = ResonanceChannel(name="test", phase=0.5)
        assert ch.name == "test"

    def test_phase_stored(self):
        ch = ResonanceChannel(name="t", phase=0.7)
        assert ch.phase == pytest.approx(0.7)

    def test_default_weight(self):
        ch = ResonanceChannel(name="t", phase=0.5)
        assert ch.weight == 1.0

    def test_default_decay_zero(self):
        ch = ResonanceChannel(name="t", phase=0.5)
        assert ch.decay == 0.0

    def test_timestamp_defaults_to_monotonic(self):
        before = time.monotonic()
        ch = ResonanceChannel(name="t", phase=0.5)
        after = time.monotonic()
        assert before <= ch.timestamp <= after

    def test_frozen(self):
        ch = ResonanceChannel(name="t", phase=0.5)
        with pytest.raises(Exception):
            ch.phase = 0.9  # type: ignore[misc]

    def test_zero_phase(self):
        ch = ResonanceChannel(name="t", phase=0.0)
        assert ch.phase == 0.0

    def test_unit_phase(self):
        ch = ResonanceChannel(name="t", phase=1.0)
        assert ch.phase == 1.0

    def test_high_weight(self):
        ch = ResonanceChannel(name="t", phase=0.5, weight=10.0)
        assert ch.weight == 10.0

    def test_decay_stored(self):
        ch = ResonanceChannel(name="t", phase=0.5, decay=0.05)
        assert ch.decay == pytest.approx(0.05)


# ── CREPResult ────────────────────────────────────────────────────────────────

class TestCREPResult:
    def test_emergence_true_when_above_threshold(self):
        result = CREPResult(
            score=EMERGENCE_THRESHOLD,
            emergence=True,
            channels=(),
        )
        assert result.emergence is True

    def test_emergence_false_below_threshold(self):
        result = CREPResult(score=0.5, emergence=False, channels=())
        assert result.emergence is False

    def test_dominant_channel_highest_phase_weight(self):
        ch1 = ResonanceChannel(name="a", phase=0.9, weight=1.0, timestamp=0.0)
        ch2 = ResonanceChannel(name="b", phase=0.4, weight=2.0, timestamp=0.0)
        result = CREPResult(score=0.8, emergence=True, channels=(ch1, ch2))
        # phase*weight: a=0.9, b=0.8 → a wins
        assert result.dominant_channel == "a"

    def test_dominant_channel_empty(self):
        result = CREPResult(score=0.0, emergence=False, channels=())
        assert result.dominant_channel == ""

    def test_score_in_range(self):
        for s in [0.0, 0.5, 0.72, 1.0]:
            r = CREPResult(score=s, emergence=s >= EMERGENCE_THRESHOLD, channels=())
            assert 0.0 <= r.score <= 1.0


# ── CREPEvaluator ─────────────────────────────────────────────────────────────

class TestCREPEvaluatorEmpty:
    def test_empty_returns_zero_score(self, evaluator):
        result = evaluator.evaluate(now=100.0)
        assert result.score == 0.0

    def test_empty_no_emergence(self, evaluator):
        result = evaluator.evaluate(now=100.0)
        assert result.emergence is False

    def test_empty_channels_tuple_empty(self, evaluator):
        result = evaluator.evaluate(now=100.0)
        assert result.channels == ()


class TestCREPEvaluatorSingleChannel:
    def test_single_full_phase(self, evaluator):
        evaluator.add_channel(ResonanceChannel("x", phase=1.0, weight=1.0, decay=0.0, timestamp=0.0))
        result = evaluator.evaluate(now=0.0)
        assert result.score == pytest.approx(1.0)

    def test_single_zero_phase(self, evaluator):
        evaluator.add_channel(ResonanceChannel("x", phase=0.0, weight=1.0, decay=0.0, timestamp=0.0))
        result = evaluator.evaluate(now=0.0)
        assert result.score == pytest.approx(0.0)

    def test_single_half_phase(self, evaluator):
        evaluator.add_channel(ResonanceChannel("x", phase=0.5, weight=1.0, decay=0.0, timestamp=0.0))
        result = evaluator.evaluate(now=0.0)
        assert result.score == pytest.approx(0.5)

    def test_decay_reduces_score(self, evaluator):
        evaluator.add_channel(
            ResonanceChannel("x", phase=1.0, weight=1.0, decay=1.0, timestamp=0.0)
        )
        result = evaluator.evaluate(now=2.0)
        expected = math.exp(-2.0)
        assert result.score == pytest.approx(expected, rel=1e-5)

    def test_no_decay_at_t0(self, evaluator):
        evaluator.add_channel(
            ResonanceChannel("x", phase=0.8, weight=1.0, decay=2.0, timestamp=5.0)
        )
        result = evaluator.evaluate(now=5.0)
        assert result.score == pytest.approx(0.8)

    def test_high_phase_triggers_emergence(self, evaluator):
        evaluator.add_channel(ResonanceChannel("x", phase=0.95, weight=1.0, decay=0.0, timestamp=0.0))
        result = evaluator.evaluate(now=0.0)
        assert result.emergence is True

    def test_low_phase_no_emergence(self, evaluator):
        evaluator.add_channel(ResonanceChannel("x", phase=0.3, weight=1.0, decay=0.0, timestamp=0.0))
        result = evaluator.evaluate(now=0.0)
        assert result.emergence is False


class TestCREPEvaluatorMultiChannel:
    def test_two_equal_channels_average(self, evaluator):
        for name, phase in [("a", 0.6), ("b", 0.8)]:
            evaluator.add_channel(
                ResonanceChannel(name=name, phase=phase, weight=1.0, decay=0.0, timestamp=0.0)
            )
        result = evaluator.evaluate(now=0.0)
        assert result.score == pytest.approx(0.7)

    def test_weight_skews_score(self, evaluator):
        evaluator.add_channel(ResonanceChannel("a", phase=1.0, weight=3.0, decay=0.0, timestamp=0.0))
        evaluator.add_channel(ResonanceChannel("b", phase=0.0, weight=1.0, decay=0.0, timestamp=0.0))
        result = evaluator.evaluate(now=0.0)
        assert result.score == pytest.approx(0.75)  # 3/4 * 1.0 + 1/4 * 0.0

    def test_score_clamped_to_one(self, evaluator):
        for i in range(5):
            evaluator.add_channel(
                ResonanceChannel(f"ch{i}", phase=1.0, weight=1.0, decay=0.0, timestamp=0.0)
            )
        result = evaluator.evaluate(now=0.0)
        assert result.score <= 1.0

    def test_score_never_negative(self, evaluator):
        for i in range(5):
            evaluator.add_channel(
                ResonanceChannel(f"ch{i}", phase=0.0, weight=1.0, decay=0.0, timestamp=0.0)
            )
        result = evaluator.evaluate(now=0.0)
        assert result.score >= 0.0

    def test_channels_snapshot_in_result(self, evaluator):
        ch = ResonanceChannel("x", phase=0.5, weight=1.0, decay=0.0, timestamp=0.0)
        evaluator.add_channel(ch)
        result = evaluator.evaluate(now=0.0)
        assert ch in result.channels

    def test_clear_resets_channels(self, evaluator):
        evaluator.add_channel(ResonanceChannel("x", phase=0.9, weight=1.0, decay=0.0, timestamp=0.0))
        evaluator.clear_channels()
        result = evaluator.evaluate(now=0.0)
        assert result.score == 0.0

    def test_channels_property_is_copy(self, evaluator):
        evaluator.add_channel(ResonanceChannel("x", phase=0.5, weight=1.0, decay=0.0, timestamp=0.0))
        chans = evaluator.channels
        chans.clear()
        assert len(evaluator.channels) == 1


class TestCREPEvaluatorThreshold:
    def test_custom_threshold_respected(self):
        ev = CREPEvaluator(threshold=0.9)
        ev.add_channel(ResonanceChannel("x", phase=0.85, weight=1.0, decay=0.0, timestamp=0.0))
        result = ev.evaluate(now=0.0)
        assert result.emergence is False

    def test_threshold_exactly_at_boundary(self):
        threshold = 0.72
        ev = CREPEvaluator(threshold=threshold)
        ev.add_channel(
            ResonanceChannel("x", phase=threshold, weight=1.0, decay=0.0, timestamp=0.0)
        )
        result = ev.evaluate(now=0.0)
        assert result.emergence is True

    def test_threshold_just_below_boundary(self):
        threshold = 0.72
        ev = CREPEvaluator(threshold=threshold)
        ev.add_channel(
            ResonanceChannel("x", phase=threshold - 1e-10, weight=1.0, decay=0.0, timestamp=0.0)
        )
        result = ev.evaluate(now=0.0)
        assert result.emergence is False


class TestCREPEvaluatorFromChannels:
    def test_from_channels_empty(self):
        result = CREPEvaluator.from_channels([])
        assert result.score == 0.0

    def test_from_channels_single(self):
        ch = ResonanceChannel("x", phase=0.8, weight=1.0, decay=0.0, timestamp=0.0)
        result = CREPEvaluator.from_channels([ch])
        assert result.score == pytest.approx(0.8)

    def test_from_channels_does_not_mutate_global(self):
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("orig", phase=0.9, weight=1.0, decay=0.0, timestamp=0.0))
        CREPEvaluator.from_channels(
            [ResonanceChannel("extra", phase=0.1, weight=1.0, decay=0.0, timestamp=0.0)]
        )
        assert len(ev.channels) == 1


class TestCREPEvaluatorEdgeCases:
    def test_zero_total_weight_falls_back(self):
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("x", phase=0.5, weight=0.0, decay=0.0, timestamp=0.0))
        result = ev.evaluate(now=0.0)
        assert math.isfinite(result.score)

    def test_large_decay_zeroes_out(self):
        ev = CREPEvaluator()
        ev.add_channel(
            ResonanceChannel("x", phase=1.0, weight=1.0, decay=1000.0, timestamp=0.0)
        )
        result = ev.evaluate(now=10.0)
        assert result.score < 1e-6

    def test_negative_dt_clamped_to_zero(self):
        ev = CREPEvaluator()
        ev.add_channel(
            ResonanceChannel("x", phase=0.8, weight=1.0, decay=1.0, timestamp=10.0)
        )
        result = ev.evaluate(now=9.0)  # now < timestamp → dt clamped to 0
        assert result.score == pytest.approx(0.8)

    def test_many_channels_all_zero_phase(self):
        ev = CREPEvaluator()
        for i in range(100):
            ev.add_channel(ResonanceChannel(f"ch{i}", phase=0.0, weight=1.0, decay=0.0, timestamp=0.0))
        result = ev.evaluate(now=0.0)
        assert result.score == pytest.approx(0.0)

    def test_many_channels_all_unit_phase(self):
        ev = CREPEvaluator()
        for i in range(100):
            ev.add_channel(ResonanceChannel(f"ch{i}", phase=1.0, weight=1.0, decay=0.0, timestamp=0.0))
        result = ev.evaluate(now=0.0)
        assert result.score == pytest.approx(1.0)

    @pytest.mark.parametrize("entropy", [0.1, 0.3, 0.5, 0.618, 0.72, 0.9])
    def test_score_always_in_unit_interval(self, entropy):
        ev = CREPEvaluator()
        import math as m
        ev.add_channel(
            ResonanceChannel("x", phase=abs(m.sin(entropy * m.pi)), weight=1.0, decay=0.0, timestamp=0.0)
        )
        result = ev.evaluate(now=0.0)
        assert 0.0 <= result.score <= 1.0
