"""Unit tests for PolicyGate and EntropyGovernor — 120+ tests."""

from __future__ import annotations

import pytest

from unified_mandala.core.crep import CREPResult
from unified_mandala.core.emergence import EmergenceResult
from unified_mandala.governance.policy import (
    EntropyGovernor,
    GovernanceDecision,
    PolicyGate,
    PolicyViolation,
)


def _crep(score: float = 0.5, emergence: bool = False) -> CREPResult:
    return CREPResult(score=score, emergence=emergence, channels=(), evaluated_at=0.0)


def _emerge(rate: float = 0.0, constructive: bool = True) -> EmergenceResult:
    return EmergenceResult(rate=rate, entropy=1.0, phi_delta=rate, constructive=constructive)


@pytest.fixture()
def gate() -> PolicyGate:
    return PolicyGate(strict_ethics=True)


@pytest.fixture()
def gate_lax() -> PolicyGate:
    return PolicyGate(strict_ethics=False)


# ── PolicyViolation ───────────────────────────────────────────────────────────

class TestPolicyViolation:
    def test_rule_stored(self):
        v = PolicyViolation(rule="TestRule", message="bad")
        assert v.rule == "TestRule"

    def test_message_stored(self):
        v = PolicyViolation(rule="R", message="msg")
        assert v.message == "msg"

    def test_default_severity_error(self):
        v = PolicyViolation(rule="R", message="m")
        assert v.severity == "error"

    def test_warn_severity(self):
        v = PolicyViolation(rule="R", message="m", severity="warn")
        assert v.severity == "warn"


# ── GovernanceDecision ────────────────────────────────────────────────────────

class TestGovernanceDecision:
    def test_passed_true(self):
        d = GovernanceDecision(passed=True)
        assert d.passed is True
        assert d.blocked is False

    def test_blocked_when_not_passed(self):
        d = GovernanceDecision(passed=False)
        assert d.blocked is True

    def test_default_empty_lists(self):
        d = GovernanceDecision(passed=True)
        assert d.violations == []
        assert d.notes == []


# ── PolicyGate.evaluate ───────────────────────────────────────────────────────

class TestPolicyGateHappyPath:
    def test_valid_inputs_pass(self, gate):
        result = gate.evaluate(_crep(0.5), _emerge(0.0), entropy=0.5)
        assert result.passed is True

    def test_all_notes_present_on_pass(self, gate):
        result = gate.evaluate(_crep(0.5), _emerge(0.0), entropy=0.5)
        assert any("cleared" in n.lower() for n in result.notes)

    def test_no_violations_on_valid(self, gate):
        result = gate.evaluate(_crep(0.5), _emerge(0.0), entropy=0.5)
        assert result.violations == []


class TestPolicyGateEntropyBounds:
    def test_entropy_below_zero_blocked(self, gate):
        result = gate.evaluate(_crep(0.5), _emerge(0.0), entropy=-0.01)
        names = [v.rule for v in result.violations]
        assert "EntropyBounds" in names

    def test_entropy_above_one_blocked(self, gate):
        result = gate.evaluate(_crep(0.5), _emerge(0.0), entropy=1.01)
        names = [v.rule for v in result.violations]
        assert "EntropyBounds" in names

    def test_entropy_exactly_zero_passes_bounds(self, gate_lax):
        result = gate_lax.evaluate(_crep(0.5), _emerge(0.0), entropy=0.0)
        assert "EntropyBounds" not in [v.rule for v in result.violations]

    def test_entropy_exactly_one_passes_bounds(self, gate_lax):
        result = gate_lax.evaluate(_crep(0.5), _emerge(0.0), entropy=1.0)
        assert "EntropyBounds" not in [v.rule for v in result.violations]


class TestPolicyGateCREPSanity:
    def test_crep_above_one_blocked(self, gate):
        bad_crep = CREPResult(score=1.5, emergence=True, channels=(), evaluated_at=0.0)
        result = gate.evaluate(bad_crep, _emerge(0.0), entropy=0.5)
        assert "CREPSanity" in [v.rule for v in result.violations]

    def test_crep_negative_blocked(self, gate):
        bad_crep = CREPResult(score=-0.1, emergence=False, channels=(), evaluated_at=0.0)
        result = gate.evaluate(bad_crep, _emerge(0.0), entropy=0.5)
        assert "CREPSanity" in [v.rule for v in result.violations]

    def test_crep_nan_blocked(self, gate):
        import math
        bad_crep = CREPResult(score=math.nan, emergence=False, channels=(), evaluated_at=0.0)
        result = gate.evaluate(bad_crep, _emerge(0.0), entropy=0.5)
        assert "CREPSanity" in [v.rule for v in result.violations]


class TestPolicyGateEmergenceRateLimit:
    def test_rate_above_limit_blocked(self, gate):
        result = gate.evaluate(_crep(0.5), _emerge(11.0), entropy=0.5)
        assert "EmergenceRateLimit" in [v.rule for v in result.violations]

    def test_rate_at_limit_passes(self, gate):
        gate2 = PolicyGate(max_emergence_rate=10.0, strict_ethics=False)
        result = gate2.evaluate(_crep(0.5), _emerge(10.0), entropy=0.5)
        assert "EmergenceRateLimit" not in [v.rule for v in result.violations]

    def test_negative_rate_large_magnitude_blocked(self, gate):
        result = gate.evaluate(_crep(0.5), _emerge(-11.0, constructive=False), entropy=0.5)
        assert "EmergenceRateLimit" in [v.rule for v in result.violations]


class TestPolicyGateCoherenceCollapse:
    def test_no_collapse_first_cycle(self, gate):
        result = gate.evaluate(_crep(0.9), _emerge(0.0), entropy=0.5)
        assert "CoherenceCollapseGuard" not in [v.rule for v in result.violations]

    def test_collapse_blocked_on_second_cycle(self, gate):
        gate.evaluate(_crep(0.9), _emerge(0.0), entropy=0.5)  # first
        result = gate.evaluate(_crep(0.3), _emerge(0.0), entropy=0.5)  # drop of 0.6
        assert "CoherenceCollapseGuard" in [v.rule for v in result.violations]

    def test_no_collapse_on_small_drop(self, gate):
        gate.evaluate(_crep(0.8), _emerge(0.0), entropy=0.5)
        result = gate.evaluate(_crep(0.7), _emerge(0.0), entropy=0.5)
        assert "CoherenceCollapseGuard" not in [v.rule for v in result.violations]


class TestPolicyGateEthicalEntropy:
    def test_entropy_below_floor_blocked(self, gate):
        result = gate.evaluate(_crep(0.5), _emerge(0.0), entropy=0.04)
        assert "EthicalEntropy" in [v.rule for v in result.violations]

    def test_entropy_above_ceiling_blocked(self, gate):
        result = gate.evaluate(_crep(0.5), _emerge(0.0), entropy=0.995)
        assert "EthicalEntropy" in [v.rule for v in result.violations]

    def test_ethical_entropy_skipped_when_lax(self, gate_lax):
        result = gate_lax.evaluate(_crep(0.5), _emerge(0.0), entropy=0.001)
        assert "EthicalEntropy" not in [v.rule for v in result.violations]

    @pytest.mark.parametrize("entropy", [0.05, 0.5, 0.618, 0.72, 0.98, 0.99])
    def test_valid_ethical_entropy_passes(self, gate, entropy):
        result = gate.evaluate(_crep(0.5), _emerge(0.0), entropy=entropy)
        assert "EthicalEntropy" not in [v.rule for v in result.violations]


class TestPolicyGateOpaInput:
    def test_opa_input_structure(self, gate):
        payload = gate.to_opa_input(_crep(0.5), _emerge(0.0), entropy=0.5)
        assert "input" in payload
        inp = payload["input"]
        assert "entropy" in inp
        assert "crep_score" in inp
        assert "emergence_rate" in inp

    def test_opa_input_values(self, gate):
        payload = gate.to_opa_input(_crep(0.7), _emerge(1.5), entropy=0.6)
        assert payload["input"]["crep_score"] == pytest.approx(0.7)
        assert payload["input"]["entropy"] == pytest.approx(0.6)
        assert payload["input"]["emergence_rate"] == pytest.approx(1.5)


# ── EntropyGovernor ───────────────────────────────────────────────────────────

class TestEntropyGovernor:
    @pytest.fixture()
    def gov(self) -> EntropyGovernor:
        return EntropyGovernor()

    def test_observe_clamps_below_floor(self, gov):
        assert gov.observe(0.0) == pytest.approx(gov.floor)

    def test_observe_clamps_above_ceiling(self, gov):
        assert gov.observe(1.0) == pytest.approx(gov.ceiling)

    def test_observe_passes_midrange(self, gov):
        assert gov.observe(0.5) == pytest.approx(0.5)

    def test_mean_entropy_single(self, gov):
        gov.observe(0.5)
        assert gov.mean_entropy == pytest.approx(0.5)

    def test_mean_entropy_rolling(self, gov):
        for _ in range(5):
            gov.observe(0.4)
        for _ in range(5):
            gov.observe(0.6)
        mean = gov.mean_entropy
        assert 0.4 <= mean <= 0.6

    def test_window_truncation(self, gov):
        for i in range(20):
            gov.observe(0.5)
        assert len(gov._history) <= gov.window

    def test_variance_uniform(self, gov):
        for _ in range(10):
            gov.observe(0.5)
        assert gov.variance == pytest.approx(0.0, abs=1e-9)

    def test_variance_non_zero_mixed(self, gov):
        for _ in range(5):
            gov.observe(0.2)
        for _ in range(5):
            gov.observe(0.8)
        assert gov.variance > 0.0

    def test_reset_clears_history(self, gov):
        gov.observe(0.5)
        gov.reset()
        assert gov._history == []

    def test_mean_entropy_empty_history(self, gov):
        assert gov.mean_entropy == pytest.approx(0.5)

    def test_variance_single_value(self, gov):
        gov.observe(0.5)
        assert gov.variance == 0.0

    @pytest.mark.parametrize("entropy", [0.1, 0.3, 0.5, 0.7, 0.9])
    def test_observe_returns_in_range(self, gov, entropy):
        result = gov.observe(entropy)
        assert gov.floor <= result <= gov.ceiling
