# Quickstart

## CLI Quickstart

```bash
# Single cycle with golden-ratio entropy
unified-mandala cycle --entropy 0.618 --simulate

# 10 cycles with visualisation
unified-mandala cycle --entropy 0.72 --cycles 10 --simulate --visualize

# JSON output for piping
unified-mandala cycle --entropy 0.5 --json | jq .crep_score

# Self-reflection report
unified-mandala reflect

# Validate entropy governance
unified-mandala validate --entropy 0.5
```

## Python API Quickstart

```python
from unified_mandala.core.mandala import MandalaOrchestrator
from unified_mandala.governance.policy import PolicyGate
from unified_mandala.integrations.registry import AdapterRegistry
from unified_mandala.sigillin.bridge import SigillinBridge

# Build the system
registry = AdapterRegistry.discover()   # auto-discovers all 17 adapters
gate = PolicyGate(strict_ethics=True)
sigillin = SigillinBridge()

orch = MandalaOrchestrator(
    registry=registry,
    policy_gate=gate,
    sigillin=sigillin,
)

# Run a cycle
result = orch.run_cycle(entropy=0.618)
print(result.summary)
print(result.sigillin_glyph)   # e.g. '◉☉'
print(result.crep.score)       # e.g. 0.821
print(result.governance_pass)  # True / False

# Self-reflection
print(orch.self_reflect())
```

## CREP Quickstart

```python
from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel

ev = CREPEvaluator(threshold=0.72)
ev.add_channel(ResonanceChannel("genesis-os", phase=0.9, weight=2.0, decay=0.005))
ev.add_channel(ResonanceChannel("sigillin", phase=0.85, weight=2.5, decay=0.001))

result = ev.evaluate()
print(f"CREP={result.score:.4f}  emerge={result.emergence}")
```

## Sigillin Quickstart

```python
from unified_mandala.sigillin.bridge import SigillinBridge
from unified_mandala.core.crep import CREPResult
from unified_mandala.core.emergence import EmergenceResult

bridge = SigillinBridge()
phi = bridge.phi(score=0.9)  # Sigillin field value
print(f"Φ = {phi:.4f}")      # 0.9975...

crep = CREPResult(score=0.9, emergence=True, channels=())
emerge = EmergenceResult(rate=1.5, entropy=2.0, phi_delta=0.5, constructive=True)
glyph = bridge.reflect(crep, emerge, cycle_id=1)
print(glyph)
# ◉☉  —  From coherence (Φ=0.998) the pattern unfolds, rate +1.5000 — emergence is.
```
