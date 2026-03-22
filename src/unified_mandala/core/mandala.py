"""MandalaOrchestrator — central hub of the unified-mandala framework.

Wires together:
* :class:`~unified_mandala.core.crep.CREPEvaluator` — resonance scoring
* :class:`~unified_mandala.sigillin.bridge.SigillinBridge` — poetic-symbolic layer
* :class:`~unified_mandala.governance.policy.PolicyGate` — ethical governance
* :class:`~unified_mandala.integrations.registry.AdapterRegistry` — 17-adapter bus
* :class:`~unified_mandala.core.emergence.EmergenceRate` — emergence computation
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Any

from loguru import logger

from unified_mandala.core.crep import CREPEvaluator, CREPResult, ResonanceChannel
from unified_mandala.core.emergence import EmergenceRate, EmergenceResult

if TYPE_CHECKING:
    from unified_mandala.governance.policy import GovernanceDecision, PolicyGate
    from unified_mandala.integrations.registry import AdapterRegistry
    from unified_mandala.sigillin.bridge import ReflectionGlyph, SigillinBridge


@dataclass
class CycleResult:
    """Full result of one mandala cycle."""

    cycle_id: int
    entropy_input: float
    crep: CREPResult
    emergence: EmergenceResult
    governance_pass: bool
    governance_notes: list[str]
    sigillin_glyph: str
    adapter_states: dict[str, Any]
    duration_s: float
    timestamp: float = field(default_factory=time.time)

    @property
    def summary(self) -> str:
        """One-line human-readable summary."""
        status = "EMERGE" if self.crep.emergence else "steady"
        gov = "PASS" if self.governance_pass else "BLOCK"
        return (
            f"Cycle {self.cycle_id:04d} | entropy={self.entropy_input:.3f} "
            f"| CREP={self.crep.score:.3f} [{status}] "
            f"| E-rate={self.emergence.rate:.4f} "
            f"| gov={gov} "
            f"| glyph={self.sigillin_glyph!r}"
        )


class MandalaOrchestrator:
    """Central orchestrator for the unified-mandala lifecycle.

    Args:
        registry: Adapter registry providing the 17 GenesisAeon adapters.
        policy_gate: Governance gate for ethical validation.
        sigillin: SigillinBridge for poetic-symbolic reflection.
        crep_threshold: CREP emergence threshold (default 0.72).

    Example::

        from unified_mandala.integrations.registry import AdapterRegistry
        from unified_mandala.governance.policy import PolicyGate
        from unified_mandala.sigillin.bridge import SigillinBridge
        from unified_mandala.core.mandala import MandalaOrchestrator

        orch = MandalaOrchestrator(
            registry=AdapterRegistry.discover(),
            policy_gate=PolicyGate(),
            sigillin=SigillinBridge(),
        )
        result = orch.run_cycle(entropy=0.618)
        print(result.summary)
    """

    def __init__(
        self,
        registry: "AdapterRegistry",
        policy_gate: "PolicyGate",
        sigillin: "SigillinBridge",
        crep_threshold: float = 0.72,
    ) -> None:
        self._registry = registry
        self._policy_gate = policy_gate
        self._sigillin = sigillin
        self._crep = CREPEvaluator(threshold=crep_threshold)
        self._emergence = EmergenceRate()
        self._cycle_counter: int = 0
        self._phi_prev: float = 0.0
        # Start 1 second in the past so first cycle has a sensible delta_t.
        self._t_prev: float = time.monotonic() - 1.0

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def run_cycle(
        self,
        entropy: float,
        phases: int = 7,
        simulate: bool = False,
    ) -> CycleResult:
        """Execute one complete mandala cycle.

        Args:
            entropy:  Input entropy level ∈ [0, 1].
            phases:   Number of resonance phases to sample (default 7).
            simulate: Dry-run — skip adapter I/O, use synthetic data.

        Returns:
            CycleResult capturing the full state of this cycle.
        """
        start = time.monotonic()
        self._cycle_counter += 1
        cid = self._cycle_counter

        logger.debug(f"[cycle {cid:04d}] start | entropy={entropy:.4f} phases={phases}")

        # 1. Gather adapter states
        adapter_states: dict[str, Any]
        if simulate:
            adapter_states = self._simulated_adapter_states(entropy, phases)
        else:
            adapter_states = self._registry.gather_all(
                entropy=entropy, phases=phases
            )

        # 2. Build resonance channels from adapter states
        self._crep.clear_channels()
        t_now = time.monotonic()
        for name, state in adapter_states.items():
            phase_val = float(state.get("phase", entropy))
            weight = float(state.get("weight", 1.0))
            decay = float(state.get("decay", 0.0))
            self._crep.add_channel(
                ResonanceChannel(
                    name=name,
                    phase=phase_val,
                    weight=weight,
                    decay=decay,
                    timestamp=t_now,
                )
            )

        # 3. CREP evaluation
        crep_result = self._crep.evaluate(now=t_now)
        logger.debug(f"[cycle {cid:04d}] CREP={crep_result.score:.4f}")

        # 4. Emergence rate
        phi_now = crep_result.score
        # Clamp delta_t to at least 1 second so rate stays bounded across
        # rapid sequential cycles in tests or real-time loops.
        dt = max(t_now - self._t_prev, 1.0)
        dist = [float(state.get("phase", 0.5)) for state in adapter_states.values()]
        if not dist:
            dist = [0.5]
        emergence_result = self._emergence.compute(
            phi_before=self._phi_prev,
            phi_after=phi_now,
            delta_t=dt,
            state_distribution=dist,
        )
        self._phi_prev = phi_now
        self._t_prev = t_now

        # 5. Governance gate
        gov_decision = self._policy_gate.evaluate(
            crep_result=crep_result,
            emergence_result=emergence_result,
            entropy=entropy,
        )

        # 6. Sigillin self-reflection
        glyph = self._sigillin.reflect(
            crep_result=crep_result,
            emergence_result=emergence_result,
            cycle_id=cid,
        )

        duration = time.monotonic() - start
        logger.info(
            f"[cycle {cid:04d}] done in {duration*1000:.1f}ms | "
            f"CREP={crep_result.score:.4f} | "
            f"gov={'PASS' if gov_decision.passed else 'BLOCK'}"
        )

        return CycleResult(
            cycle_id=cid,
            entropy_input=entropy,
            crep=crep_result,
            emergence=emergence_result,
            governance_pass=gov_decision.passed,
            governance_notes=list(gov_decision.notes),
            sigillin_glyph=glyph.symbol,
            adapter_states=adapter_states,
            duration_s=duration,
        )

    def self_reflect(self) -> str:
        """Introspective report: CREP state, adapter health, cycle count.

        Returns:
            Multi-line ASCII reflection report.
        """
        lines = [
            "╔══ MandalaOrchestrator · self_reflect() ══╗",
            f"  cycles completed : {self._cycle_counter}",
            f"  registered adapters: {len(self._registry)}",
            f"  φ (Sigillin field) : {self._phi_prev:.6f}",
            f"  CREP channels     : {len(self._crep.channels)}",
            "  adapter manifest  :",
        ]
        for name in self._registry.names:
            lines.append(f"    · {name}")
        lines.append("╚══════════════════════════════════════════╝")
        return "\n".join(lines)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _simulated_adapter_states(
        self, entropy: float, phases: int
    ) -> dict[str, Any]:
        """Generate synthetic adapter states for simulation/testing."""
        import math

        states: dict[str, Any] = {}
        # Use all registered adapter names so simulate mode matches the real
        # adapter count.  The ``phases`` argument controls angular sampling.
        names = self._registry.names or [f"sim_{i}" for i in range(phases)]
        for idx, name in enumerate(names):
            angle = (2 * math.pi * idx) / max(len(names), 1)
            states[name] = {
                "phase": max(0.0, min(1.0, entropy * abs(math.sin(angle + 0.1)))),
                "weight": 1.0 + (idx % 3) * 0.5,
                "decay": 0.01 * (idx % 5),
                "simulated": True,
            }
        return states
