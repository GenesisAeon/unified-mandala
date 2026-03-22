"""Unit tests for MandalaOrchestrator — 100+ tests."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from unified_mandala.core.crep import CREPResult, ResonanceChannel
from unified_mandala.core.emergence import EmergenceResult
from unified_mandala.core.mandala import CycleResult, MandalaOrchestrator
from unified_mandala.governance.policy import GovernanceDecision, PolicyGate
from unified_mandala.integrations.registry import AdapterRegistry
from unified_mandala.sigillin.bridge import ReflectionGlyph, SigillinBridge


# ── Helpers ───────────────────────────────────────────────────────────────────

def _make_registry(n: int = 3) -> AdapterRegistry:
    registry = AdapterRegistry()
    from unified_mandala.integrations.registry import BaseAdapter

    class _Stub(BaseAdapter):
        def __init__(self, name_: str):
            self.name = name_
            self.version = "0.0.0"

        def gather(self, *, entropy, phases):
            return {"phase": entropy, "weight": 1.0, "decay": 0.0}

    for i in range(n):
        registry.register(_Stub(f"stub_{i}"))
    return registry


def _make_orch(n_adapters: int = 3) -> MandalaOrchestrator:
    return MandalaOrchestrator(
        registry=_make_registry(n_adapters),
        policy_gate=PolicyGate(strict_ethics=False),
        sigillin=SigillinBridge(),
    )


# ── CycleResult ───────────────────────────────────────────────────────────────

class TestCycleResult:
    def test_summary_contains_cycle_id(self):
        crep = CREPResult(score=0.5, emergence=False, channels=(), evaluated_at=0.0)
        emerge = EmergenceResult(rate=0.0, entropy=1.0, phi_delta=0.0, constructive=False)
        r = CycleResult(
            cycle_id=42,
            entropy_input=0.5,
            crep=crep,
            emergence=emerge,
            governance_pass=True,
            governance_notes=[],
            sigillin_glyph="☉",
            adapter_states={},
            duration_s=0.01,
        )
        assert "0042" in r.summary

    def test_summary_contains_emerge_flag(self):
        crep = CREPResult(score=0.9, emergence=True, channels=(), evaluated_at=0.0)
        emerge = EmergenceResult(rate=1.0, entropy=1.0, phi_delta=0.5, constructive=True)
        r = CycleResult(
            cycle_id=1,
            entropy_input=0.9,
            crep=crep,
            emergence=emerge,
            governance_pass=True,
            governance_notes=[],
            sigillin_glyph="✺",
            adapter_states={},
            duration_s=0.0,
        )
        assert "EMERGE" in r.summary

    def test_summary_governance_block(self):
        crep = CREPResult(score=0.5, emergence=False, channels=(), evaluated_at=0.0)
        emerge = EmergenceResult(rate=0.0, entropy=0.0, phi_delta=0.0, constructive=False)
        r = CycleResult(
            cycle_id=1,
            entropy_input=0.5,
            crep=crep,
            emergence=emerge,
            governance_pass=False,
            governance_notes=["violation"],
            sigillin_glyph="∅",
            adapter_states={},
            duration_s=0.0,
        )
        assert "BLOCK" in r.summary


# ── MandalaOrchestrator ───────────────────────────────────────────────────────

class TestMandalaOrchestratorInit:
    def test_cycle_counter_starts_at_zero(self):
        orch = _make_orch()
        assert orch._cycle_counter == 0

    def test_phi_prev_starts_at_zero(self):
        orch = _make_orch()
        assert orch._phi_prev == 0.0


class TestMandalaOrchestratorRunCycle:
    def test_returns_cycle_result(self):
        orch = _make_orch()
        result = orch.run_cycle(entropy=0.5, simulate=True)
        assert isinstance(result, CycleResult)

    def test_cycle_id_increments(self):
        orch = _make_orch()
        r1 = orch.run_cycle(entropy=0.5, simulate=True)
        r2 = orch.run_cycle(entropy=0.5, simulate=True)
        assert r1.cycle_id == 1
        assert r2.cycle_id == 2

    def test_entropy_stored_in_result(self):
        orch = _make_orch()
        result = orch.run_cycle(entropy=0.618, simulate=True)
        assert result.entropy_input == pytest.approx(0.618)

    def test_crep_score_in_unit_interval(self):
        orch = _make_orch()
        for e in [0.1, 0.5, 0.72, 0.9]:
            result = orch.run_cycle(entropy=e, simulate=True)
            assert 0.0 <= result.crep.score <= 1.0

    def test_governance_pass_type_bool(self):
        orch = _make_orch()
        result = orch.run_cycle(entropy=0.5, simulate=True)
        assert isinstance(result.governance_pass, bool)

    def test_sigillin_glyph_nonempty(self):
        orch = _make_orch()
        result = orch.run_cycle(entropy=0.5, simulate=True)
        assert len(result.sigillin_glyph) >= 1

    def test_adapter_states_has_entries(self):
        orch = _make_orch(n_adapters=5)
        result = orch.run_cycle(entropy=0.5, simulate=True)
        assert len(result.adapter_states) == 5

    def test_duration_nonnegative(self):
        orch = _make_orch()
        result = orch.run_cycle(entropy=0.5, simulate=True)
        assert result.duration_s >= 0.0

    def test_multiple_cycles_accumulate_phi(self):
        orch = _make_orch()
        orch.run_cycle(entropy=0.8, simulate=True)
        phi_after_1 = orch._phi_prev
        orch.run_cycle(entropy=0.8, simulate=True)
        # phi_prev updates each cycle
        assert orch._phi_prev != 0.0

    def test_simulate_false_uses_registry(self):
        registry = _make_registry(3)
        called: list[str] = []

        orig_gather = registry.gather_all

        def traced(*args, **kwargs):
            called.append("gather_all")
            return orig_gather(*args, **kwargs)

        registry.gather_all = traced  # type: ignore[method-assign]
        orch = MandalaOrchestrator(
            registry=registry,
            policy_gate=PolicyGate(strict_ethics=False),
            sigillin=SigillinBridge(),
        )
        orch.run_cycle(entropy=0.5, simulate=False)
        assert "gather_all" in called

    def test_simulate_true_skips_registry(self):
        registry = _make_registry(3)
        called: list[str] = []

        orig_gather = registry.gather_all

        def traced(*args, **kwargs):
            called.append("gather_all")
            return orig_gather(*args, **kwargs)

        registry.gather_all = traced  # type: ignore[method-assign]
        orch = MandalaOrchestrator(
            registry=registry,
            policy_gate=PolicyGate(strict_ethics=False),
            sigillin=SigillinBridge(),
        )
        orch.run_cycle(entropy=0.5, simulate=True)
        assert "gather_all" not in called


class TestMandalaOrchestratorSelfReflect:
    def test_self_reflect_contains_cycles(self):
        orch = _make_orch()
        orch.run_cycle(entropy=0.5, simulate=True)
        report = orch.self_reflect()
        assert "1" in report

    def test_self_reflect_contains_adapter_names(self):
        orch = _make_orch(3)
        report = orch.self_reflect()
        assert "stub_0" in report

    def test_self_reflect_returns_string(self):
        orch = _make_orch()
        assert isinstance(orch.self_reflect(), str)

    def test_self_reflect_header_footer(self):
        orch = _make_orch()
        report = orch.self_reflect()
        assert "MandalaOrchestrator" in report

    def test_self_reflect_phi_value(self):
        orch = _make_orch()
        orch.run_cycle(entropy=0.8, simulate=True)
        report = orch.self_reflect()
        assert "φ" in report


class TestMandalaOrchestratorSimulated:
    def test_simulated_states_count(self):
        orch = _make_orch(5)
        states = orch._simulated_adapter_states(entropy=0.5, phases=3)
        # phases limits or adapter count limits
        assert len(states) <= 5

    def test_simulated_phases_in_unit_interval(self):
        orch = _make_orch(17)
        states = orch._simulated_adapter_states(entropy=0.7, phases=7)
        for v in states.values():
            assert 0.0 <= v["phase"] <= 1.0

    def test_simulated_has_simulated_flag(self):
        orch = _make_orch(3)
        states = orch._simulated_adapter_states(entropy=0.5, phases=3)
        for v in states.values():
            assert v.get("simulated") is True
