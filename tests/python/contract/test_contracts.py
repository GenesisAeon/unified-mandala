"""Contract tests between packages — 60+ tests.

Verifies that every adapter's gather() output satisfies the
BaseAdapter contract as consumed by MandalaOrchestrator.
"""

from __future__ import annotations

import itertools
import math

import pytest

from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
from unified_mandala.core.mandala import MandalaOrchestrator
from unified_mandala.governance.policy import PolicyGate
from unified_mandala.integrations.adapters.advanced_weighting import AdvancedWeightingAdapter
from unified_mandala.integrations.adapters.aeon_ai import AeonAiAdapter
from unified_mandala.integrations.adapters.climate_dashboard import ClimateDashboardAdapter
from unified_mandala.integrations.adapters.cosmic_web import CosmicWebAdapter
from unified_mandala.integrations.adapters.entropy_governance import EntropyGovernanceAdapter
from unified_mandala.integrations.adapters.entropy_table import EntropyTableAdapter
from unified_mandala.integrations.adapters.field_resonance import FieldResonanceAdapter
from unified_mandala.integrations.adapters.fieldtheory import FieldtheoryAdapter
from unified_mandala.integrations.adapters.fractal_membrane import FractalMembraneAdapter
from unified_mandala.integrations.adapters.genesis_os import GenesisOsAdapter
from unified_mandala.integrations.adapters.implosive_genesis import ImplosiveGenesisAdapter
from unified_mandala.integrations.adapters.mandala_visualizer import MandalaVisualizerAdapter
from unified_mandala.integrations.adapters.mirror_machine import MirrorMachineAdapter
from unified_mandala.integrations.adapters.quantum_mesh import QuantumMeshAdapter
from unified_mandala.integrations.adapters.sigillin_adapter import SigillinAdapter
from unified_mandala.integrations.adapters.sonification import SonificationAdapter
from unified_mandala.integrations.adapters.universums_sim import UniversumsSimAdapter
from unified_mandala.integrations.adapters.utac_core import UtacCoreAdapter
from unified_mandala.integrations.registry import AdapterRegistry
from unified_mandala.sigillin.bridge import SigillinBridge

ALL_ADAPTER_CLASSES = [
    GenesisOsAdapter,
    UniversumsSimAdapter,
    AeonAiAdapter,
    AdvancedWeightingAdapter,
    FieldtheoryAdapter,
    MirrorMachineAdapter,
    CosmicWebAdapter,
    EntropyGovernanceAdapter,
    EntropyTableAdapter,
    SigillinAdapter,
    UtacCoreAdapter,
    MandalaVisualizerAdapter,
    SonificationAdapter,
    ClimateDashboardAdapter,
    ImplosiveGenesisAdapter,
    FieldResonanceAdapter,
    QuantumMeshAdapter,
    FractalMembraneAdapter,
]


class TestAdapterToOrchContract:
    """Each adapter's output must be consumable by MandalaOrchestrator."""

    @pytest.mark.parametrize("AdapterCls", ALL_ADAPTER_CLASSES)
    def test_adapter_output_drives_crep_channel(self, AdapterCls):
        adapter = AdapterCls()
        state = adapter.gather(entropy=0.5, phases=7)

        phase = float(state.get("phase", 0.5))
        weight = float(state.get("weight", 1.0))
        decay = float(state.get("decay", 0.0))

        ch = ResonanceChannel(
            name=adapter.name,
            phase=phase,
            weight=weight,
            decay=decay,
            timestamp=0.0,
        )
        ev = CREPEvaluator()
        ev.add_channel(ch)
        result = ev.evaluate(now=0.0)

        assert 0.0 <= result.score <= 1.0
        assert isinstance(result.emergence, bool)

    @pytest.mark.parametrize("AdapterCls", ALL_ADAPTER_CLASSES)
    def test_adapter_in_full_registry_cycle(self, AdapterCls):
        """Single-adapter registry drives a complete cycle."""
        registry = AdapterRegistry()
        registry.register(AdapterCls())

        orch = MandalaOrchestrator(
            registry=registry,
            policy_gate=PolicyGate(strict_ethics=False),
            sigillin=SigillinBridge(),
        )
        result = orch.run_cycle(entropy=0.5, simulate=False)
        assert 0.0 <= result.crep.score <= 1.0

    @pytest.mark.parametrize("AdapterCls", ALL_ADAPTER_CLASSES)
    def test_adapter_phase_is_valid_crep_input(self, AdapterCls):
        adapter = AdapterCls()
        for entropy in [0.0, 0.5, 1.0]:
            state = adapter.gather(entropy=entropy, phases=7)
            phase = state["phase"]
            assert math.isfinite(phase)
            assert 0.0 <= phase <= 1.0


class TestPolicyGateToOrchContract:
    """PolicyGate output must align with MandalaOrchestrator decisions."""

    def test_strict_gate_blocks_invalid_cycle(self):
        registry = AdapterRegistry.discover()
        gate = PolicyGate(strict_ethics=True)
        orch = MandalaOrchestrator(
            registry=registry,
            policy_gate=gate,
            sigillin=SigillinBridge(),
        )
        result = orch.run_cycle(entropy=0.02, simulate=True)
        assert result.governance_pass is False

    def test_opa_input_matches_result_crep(self):
        gate = PolicyGate(strict_ethics=False)
        registry = AdapterRegistry.discover()
        orch = MandalaOrchestrator(
            registry=registry,
            policy_gate=gate,
            sigillin=SigillinBridge(),
        )
        result = orch.run_cycle(entropy=0.5, simulate=True)
        opa = gate.to_opa_input(result.crep, result.emergence, entropy=0.5)
        assert opa["input"]["crep_score"] == pytest.approx(result.crep.score)


class TestSigillinToCrePContract:
    """SigillinBridge phi() must agree with CREPEvaluator score ordering."""

    def test_phi_monotone_with_crep_score(self):
        from unified_mandala.sigillin.bridge import SigillinBridge

        bridge = SigillinBridge()
        scores = [0.0, 0.3, 0.5, 0.72, 0.9, 1.0]
        phis = [bridge.phi(s) for s in scores]
        for a, b in itertools.pairwise(phis):
            assert a <= b, f"phi not monotone: {a} > {b}"

    def test_reflect_accepts_crep_result(self):
        from unified_mandala.core.crep import CREPResult
        from unified_mandala.core.emergence import EmergenceResult
        from unified_mandala.sigillin.bridge import SigillinBridge

        bridge = SigillinBridge()
        cr = CREPResult(score=0.8, emergence=True, channels=(), evaluated_at=0.0)
        er = EmergenceResult(rate=1.0, entropy=1.0, phi_delta=0.5, constructive=True)
        glyph = bridge.reflect(cr, er, cycle_id=1)
        assert glyph.phi_value == pytest.approx(bridge.phi(0.8))


class TestGovernanceToAdapterContract:
    """Governance OPA inputs must represent adapter-sourced CREP scores."""

    @pytest.mark.parametrize("AdapterCls", ALL_ADAPTER_CLASSES)
    def test_opa_payload_from_adapter_state(self, AdapterCls):
        adapter = AdapterCls()
        state = adapter.gather(entropy=0.5, phases=7)
        phase = state["phase"]
        weight = state["weight"]
        decay = state.get("decay", 0.0)

        ev = CREPEvaluator()
        ev.add_channel(
            ResonanceChannel(adapter.name, phase=phase, weight=weight, decay=decay, timestamp=0.0)
        )
        crep_result = ev.evaluate(now=0.0)

        from unified_mandala.core.emergence import EmergenceRate

        er = EmergenceRate()
        emerge_result = er.compute(0.4, crep_result.score, 1.0, [0.5, 0.5])

        gate = PolicyGate(strict_ethics=False)
        payload = gate.to_opa_input(crep_result, emerge_result, entropy=0.5)
        assert payload["input"]["crep_score"] == pytest.approx(crep_result.score)
        assert "entropy" in payload["input"]
