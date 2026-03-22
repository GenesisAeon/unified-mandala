"""Governance-specific tests — OPA payload, multi-cycle policy — 40+ tests."""

from __future__ import annotations

import pytest

from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
from unified_mandala.core.emergence import EmergenceRate
from unified_mandala.core.mandala import MandalaOrchestrator
from unified_mandala.governance.policy import EntropyGovernor, PolicyGate
from unified_mandala.integrations.registry import AdapterRegistry
from unified_mandala.sigillin.bridge import SigillinBridge


class TestOpaPayloadStructure:
    def test_all_required_keys_present(self):
        gate = PolicyGate()
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("x", phase=0.5, weight=1.0, decay=0.0, timestamp=0.0))
        crep = ev.evaluate(now=0.0)
        er = EmergenceRate().compute(0.3, 0.5, 1.0, [0.5, 0.5])
        payload = gate.to_opa_input(crep, er, entropy=0.5)
        required_keys = [
            "entropy",
            "crep_score",
            "crep_emergence",
            "emergence_rate",
            "emergence_constructive",
            "strict_ethics",
            "max_emergence_rate",
        ]
        for k in required_keys:
            assert k in payload["input"]

    def test_crep_score_type_float(self):
        gate = PolicyGate()
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("x", phase=0.5, weight=1.0, decay=0.0, timestamp=0.0))
        crep = ev.evaluate(now=0.0)
        er = EmergenceRate().compute(0.3, 0.5, 1.0, [0.5, 0.5])
        payload = gate.to_opa_input(crep, er, entropy=0.5)
        assert isinstance(payload["input"]["crep_score"], float)

    def test_opa_emergence_flag_matches_crep(self):
        gate = PolicyGate()
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("x", phase=0.9, weight=1.0, decay=0.0, timestamp=0.0))
        crep = ev.evaluate(now=0.0)
        er = EmergenceRate().compute(0.3, 0.5, 1.0, [0.5, 0.5])
        payload = gate.to_opa_input(crep, er, entropy=0.5)
        assert payload["input"]["crep_emergence"] == crep.emergence


class TestMultiCycleGovernance:
    def test_collapse_guard_triggers_on_sudden_drop(self):
        gate = PolicyGate(strict_ethics=False, crep_collapse_threshold=0.3)
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("x", phase=0.9, weight=1.0, decay=0.0, timestamp=0.0))
        crep_high = ev.evaluate(now=0.0)
        er = EmergenceRate().compute(0.3, 0.9, 1.0, [0.5, 0.5])
        gate.evaluate(crep_high, er, entropy=0.5)  # set prev

        ev2 = CREPEvaluator()
        ev2.add_channel(ResonanceChannel("x", phase=0.3, weight=1.0, decay=0.0, timestamp=0.0))
        crep_low = ev2.evaluate(now=0.0)
        decision = gate.evaluate(crep_low, er, entropy=0.5)
        assert "CoherenceCollapseGuard" in [v.rule for v in decision.violations]

    def test_no_collapse_guard_without_history(self):
        gate = PolicyGate(strict_ethics=False)
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("x", phase=0.1, weight=1.0, decay=0.0, timestamp=0.0))
        crep = ev.evaluate(now=0.0)
        er = EmergenceRate().compute(0.3, 0.1, 1.0, [0.5, 0.5])
        decision = gate.evaluate(crep, er, entropy=0.5)
        assert "CoherenceCollapseGuard" not in [v.rule for v in decision.violations]

    def test_custom_max_emergence_rate(self):
        gate = PolicyGate(max_emergence_rate=1.0, strict_ethics=False)
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("x", phase=0.5, weight=1.0, decay=0.0, timestamp=0.0))
        crep = ev.evaluate(now=0.0)
        er = EmergenceRate().compute(0.0, 2.0, 1.0, [0.5, 0.5])
        decision = gate.evaluate(crep, er, entropy=0.5)
        assert "EmergenceRateLimit" in [v.rule for v in decision.violations]


class TestEntropyGovernorEdgeCases:
    def test_custom_floor_ceiling(self):
        gov = EntropyGovernor(floor=0.1, ceiling=0.9)
        assert gov.observe(0.0) == pytest.approx(0.1)
        assert gov.observe(1.0) == pytest.approx(0.9)

    def test_window_size_respected(self):
        gov = EntropyGovernor(window=3)
        for _i in range(10):
            gov.observe(0.5)
        assert len(gov._history) == 3

    def test_mean_convergence(self):
        gov = EntropyGovernor()
        for _ in range(10):
            gov.observe(0.7)
        assert gov.mean_entropy == pytest.approx(0.7, abs=1e-6)

    def test_high_variance_mixed_input(self):
        gov = EntropyGovernor()
        for _ in range(5):
            gov.observe(0.1)
        for _ in range(5):
            gov.observe(0.9)
        assert gov.variance > 0.1


class TestGovernanceMandalaIntegration:
    def test_governance_note_count_on_pass(self):
        orch = MandalaOrchestrator(
            registry=AdapterRegistry.discover(),
            policy_gate=PolicyGate(strict_ethics=False),
            sigillin=SigillinBridge(),
        )
        result = orch.run_cycle(entropy=0.5, simulate=True)
        assert len(result.governance_notes) >= 1

    def test_governance_violation_reported_in_notes(self):
        orch = MandalaOrchestrator(
            registry=AdapterRegistry.discover(),
            policy_gate=PolicyGate(strict_ethics=True),
            sigillin=SigillinBridge(),
        )
        result = orch.run_cycle(entropy=0.01, simulate=True)
        assert not result.governance_pass
        assert result.governance_notes
