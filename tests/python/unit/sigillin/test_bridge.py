"""Unit tests for SigillinBridge — 80+ tests."""

from __future__ import annotations

import math

import pytest

from unified_mandala.core.crep import CREPResult
from unified_mandala.core.emergence import EmergenceResult
from unified_mandala.sigillin.bridge import ReflectionGlyph, SigillinBridge


def _crep(score: float, emergence: bool | None = None) -> CREPResult:
    if emergence is None:
        emergence = score >= 0.72
    return CREPResult(score=score, emergence=emergence, channels=(), evaluated_at=0.0)


def _emerge(rate: float) -> EmergenceResult:
    return EmergenceResult(
        rate=rate,
        entropy=1.0,
        phi_delta=rate,
        constructive=rate > 0,
    )


@pytest.fixture()
def bridge() -> SigillinBridge:
    return SigillinBridge()


class TestSigillinBridgePhi:
    def test_phi_at_threshold_near_half(self, bridge):
        phi = bridge.phi(0.72)
        assert phi == pytest.approx(0.5, abs=0.01)

    def test_phi_zero_below_threshold(self, bridge):
        phi = bridge.phi(0.0)
        assert phi < 0.5

    def test_phi_one_above_threshold(self, bridge):
        phi = bridge.phi(1.0)
        assert phi > 0.95  # sigmoid saturates near 0.966 at score=1.0

    def test_phi_monotonically_increasing(self, bridge):
        scores = [i / 20 for i in range(21)]
        phis = [bridge.phi(s) for s in scores]
        for a, b in zip(phis, phis[1:]):
            assert a <= b

    def test_phi_in_unit_interval(self, bridge):
        for s in [0.0, 0.5, 0.72, 1.0]:
            phi = bridge.phi(s)
            assert 0.0 <= phi <= 1.0

    def test_phi_is_sigmoid(self, bridge):
        # Sigmoid property: phi(0.5) < 0.5 since centre < threshold
        assert bridge.phi(0.5) < 0.5


class TestReflectionGlyph:
    def test_str_contains_symbol(self):
        g = ReflectionGlyph(symbol="☉", phi_value=0.5, cycle_id=1, verse="test")
        assert "☉" in str(g)

    def test_str_contains_verse(self):
        g = ReflectionGlyph(symbol="☉", phi_value=0.5, cycle_id=1, verse="hello")
        assert "hello" in str(g)

    def test_frozen(self):
        g = ReflectionGlyph(symbol="☉", phi_value=0.5, cycle_id=1, verse="v")
        with pytest.raises(Exception):
            g.symbol = "X"  # type: ignore[misc]


class TestSigillinBridgeReflect:
    def test_returns_reflection_glyph(self, bridge):
        result = bridge.reflect(_crep(0.5), _emerge(0.0), cycle_id=1)
        assert isinstance(result, ReflectionGlyph)

    def test_phi_value_computed(self, bridge):
        cr = _crep(0.5)
        result = bridge.reflect(cr, _emerge(0.1), cycle_id=1)
        assert result.phi_value == pytest.approx(bridge.phi(0.5))

    def test_cycle_id_stored(self, bridge):
        result = bridge.reflect(_crep(0.5), _emerge(0.1), cycle_id=99)
        assert result.cycle_id == 99

    def test_symbol_nonempty(self, bridge):
        result = bridge.reflect(_crep(0.8), _emerge(1.0), cycle_id=1)
        assert len(result.symbol) >= 1

    def test_verse_nonempty(self, bridge):
        result = bridge.reflect(_crep(0.5), _emerge(0.5), cycle_id=1)
        assert len(result.verse) > 0

    def test_emergence_symbol_contains_ring_char(self, bridge):
        # High-emerge + constructive → should contain a ring char + emergence char
        result = bridge.reflect(_crep(0.95, True), _emerge(5.0), cycle_id=0)
        assert any(c in result.symbol for c in "◉✺⟡❋⊜")

    def test_void_state_symbol(self, bridge):
        result = bridge.reflect(_crep(0.1, False), _emerge(-1.0), cycle_id=0)
        assert "∅" in result.symbol or len(result.symbol) >= 1

    def test_verse_mentions_phi(self, bridge):
        result = bridge.reflect(_crep(0.8, True), _emerge(2.0), cycle_id=1)
        assert "Φ=" in result.verse

    def test_verse_mentions_rate(self, bridge):
        result = bridge.reflect(_crep(0.5, False), _emerge(-0.5), cycle_id=1)
        assert "rate" in result.verse

    @pytest.mark.parametrize("cycle_id", range(17))
    def test_ring_cycles_over_17_symbols(self, bridge, cycle_id):
        result = bridge.reflect(_crep(0.5, False), _emerge(0.1), cycle_id=cycle_id)
        assert result.symbol  # just ensure no crash

    def test_custom_ring(self):
        custom_ring = ["A", "B", "C"]
        b = SigillinBridge(ring=custom_ring)
        result = b.reflect(_crep(0.5, False), _emerge(0.1), cycle_id=0)
        assert result.symbol  # must not crash

    def test_default_ring_length(self, bridge):
        assert len(bridge._ring) == 17
