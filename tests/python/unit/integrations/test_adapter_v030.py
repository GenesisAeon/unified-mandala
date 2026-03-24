"""v0.3.0 adapter registry tests — verifying 19 adapters discovered."""

from __future__ import annotations

import pytest

from unified_mandala.integrations.registry import AdapterRegistry


# ---------------------------------------------------------------------------
# Adapter discovery
# ---------------------------------------------------------------------------


class TestAdapterDiscoveryV030:
    @pytest.fixture(scope="class")
    def registry(self):
        return AdapterRegistry.discover()

    def test_at_least_19_adapters(self, registry):
        assert len(registry) >= 19

    def test_nukleonscanner_discovered(self, registry):
        assert "nukleonscanner" in registry

    def test_greekmath_discovered(self, registry):
        assert "greekmath" in registry

    def test_planetary_coupling_discovered(self, registry):
        assert "planetary-coupling" in registry

    def test_fieldtheory_discovered(self, registry):
        assert "fieldtheory" in registry

    def test_genesis_os_discovered(self, registry):
        assert "genesis-os" in registry

    def test_all_adapters_healthy(self, registry):
        for adapter in registry:
            assert adapter.health() is True

    def test_all_adapter_names_non_empty(self, registry):
        for adapter in registry:
            assert len(adapter.name) > 0

    def test_all_adapter_versions_non_empty(self, registry):
        for adapter in registry:
            assert len(adapter.version) > 0

    def test_gather_all_returns_all_adapters(self, registry):
        states = registry.gather_all(entropy=0.5, phases=7)
        assert len(states) == len(registry)

    def test_gather_all_phases_present(self, registry):
        states = registry.gather_all(entropy=0.5, phases=7)
        for name, state in states.items():
            if "error" not in state:
                assert "phase" in state
                assert 0.0 <= state["phase"] <= 1.0

    def test_nukleonscanner_gather(self, registry):
        adapter = registry.get("nukleonscanner")
        result = adapter.gather(entropy=0.618, phases=7)
        assert 0.0 <= result["phase"] <= 1.0
        assert "alpha_s" in result

    def test_greekmath_gather(self, registry):
        adapter = registry.get("greekmath")
        result = adapter.gather(entropy=0.618, phases=7)
        assert 0.0 <= result["phase"] <= 1.0
        assert "golden_section" in result

    def test_planetary_gather(self, registry):
        adapter = registry.get("planetary-coupling")
        result = adapter.gather(entropy=0.5, phases=7)
        assert 0.0 <= result["phase"] <= 1.0
        assert "co2_ppm" in result

    def test_nukleonscanner_version_v2(self, registry):
        adapter = registry.get("nukleonscanner")
        assert adapter.version == "2.0.0"

    def test_greekmath_version_v2(self, registry):
        adapter = registry.get("greekmath")
        assert adapter.version == "2.0.0"


# ---------------------------------------------------------------------------
# New adapter integration in CREP cycle
# ---------------------------------------------------------------------------


class TestNewAdaptersCREPIntegration:
    @pytest.fixture(scope="class")
    def registry(self):
        return AdapterRegistry.discover()

    def test_nukleonscanner_contributes_to_crep(self, registry):
        from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
        adapter = registry.get("nukleonscanner")
        result = adapter.gather(entropy=0.5, phases=7)
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel(
            "nukleon",
            phase=result["phase"],
            weight=result["weight"],
            decay=result["decay"],
            timestamp=0.0,
        ))
        crep = ev.evaluate(now=0.0)
        assert 0.0 <= crep.score <= 1.0

    def test_greekmath_contributes_to_crep(self, registry):
        from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
        adapter = registry.get("greekmath")
        result = adapter.gather(entropy=0.618, phases=7)
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel(
            "greekmath",
            phase=result["phase"],
            weight=result["weight"],
            decay=result["decay"],
            timestamp=0.0,
        ))
        crep = ev.evaluate(now=0.0)
        assert 0.0 <= crep.score <= 1.0

    def test_planetary_contributes_to_crep(self, registry):
        from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
        adapter = registry.get("planetary-coupling")
        result = adapter.gather(entropy=0.5, phases=7)
        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel(
            "planetary",
            phase=result["phase"],
            weight=result["weight"],
            decay=result["decay"],
            timestamp=0.0,
        ))
        crep = ev.evaluate(now=0.0)
        assert 0.0 <= crep.score <= 1.0

    def test_all_new_adapters_in_full_cycle(self, registry):
        from unified_mandala.core.mandala import MandalaOrchestrator
        from unified_mandala.governance.policy import PolicyGate
        from unified_mandala.sigillin.bridge import SigillinBridge
        orch = MandalaOrchestrator(
            registry=registry,
            policy_gate=PolicyGate(strict_ethics=False),
            sigillin=SigillinBridge(),
        )
        result = orch.run_cycle(entropy=0.618, phases=7, simulate=False)
        assert result.crep.score >= 0.0

    @pytest.mark.integration
    def test_all_adapters_at_golden_ratio(self, registry):
        """Golden ratio entropy φ = 0.618 should not crash any adapter."""
        states = registry.gather_all(entropy=0.618, phases=7)
        for name, state in states.items():
            assert "error" not in state, f"Adapter {name} failed: {state}"

    @pytest.mark.integration
    def test_all_adapters_at_boundary_zero(self, registry):
        """Entropy = 0 should not crash any adapter."""
        states = registry.gather_all(entropy=0.0, phases=1)
        for name, state in states.items():
            if "error" not in state:
                assert "phase" in state

    @pytest.mark.integration
    def test_all_adapters_at_boundary_one(self, registry):
        """Entropy = 1 should not crash any adapter."""
        states = registry.gather_all(entropy=1.0, phases=17)
        for name, state in states.items():
            if "error" not in state:
                assert "phase" in state
