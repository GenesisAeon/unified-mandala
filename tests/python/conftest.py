"""Shared pytest fixtures and helpers for unified-mandala test suite."""

from __future__ import annotations

import pytest

from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
from unified_mandala.core.emergence import EmergenceRate
from unified_mandala.core.mandala import MandalaOrchestrator
from unified_mandala.governance.policy import PolicyGate
from unified_mandala.integrations.registry import AdapterRegistry
from unified_mandala.sigillin.bridge import SigillinBridge


@pytest.fixture(scope="session")
def adapter_registry() -> AdapterRegistry:
    """Session-scoped adapter registry with all 17+ built-in adapters."""
    return AdapterRegistry.discover()


@pytest.fixture(scope="session")
def session_orch(adapter_registry: AdapterRegistry) -> MandalaOrchestrator:
    """Session-scoped orchestrator for read-only integration tests."""
    return MandalaOrchestrator(
        registry=adapter_registry,
        policy_gate=PolicyGate(strict_ethics=False),
        sigillin=SigillinBridge(),
    )


@pytest.fixture()
def fresh_orch() -> MandalaOrchestrator:
    """Fresh orchestrator per test."""
    return MandalaOrchestrator(
        registry=AdapterRegistry.discover(),
        policy_gate=PolicyGate(strict_ethics=False),
        sigillin=SigillinBridge(),
    )


@pytest.fixture()
def crep_evaluator() -> CREPEvaluator:
    return CREPEvaluator()


@pytest.fixture()
def emergence_rate() -> EmergenceRate:
    return EmergenceRate()


@pytest.fixture()
def sigillin_bridge() -> SigillinBridge:
    return SigillinBridge()


@pytest.fixture()
def policy_gate() -> PolicyGate:
    return PolicyGate(strict_ethics=True)


@pytest.fixture()
def policy_gate_lax() -> PolicyGate:
    return PolicyGate(strict_ethics=False)


# Standard resonance channels for parameterised tests
HIGH_CHANNEL = ResonanceChannel(name="high", phase=0.9, weight=1.0, decay=0.0, timestamp=0.0)
LOW_CHANNEL = ResonanceChannel(name="low", phase=0.1, weight=1.0, decay=0.0, timestamp=0.0)
MID_CHANNEL = ResonanceChannel(name="mid", phase=0.5, weight=1.0, decay=0.0, timestamp=0.0)
