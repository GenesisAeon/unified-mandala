# Ethical Governance

## Overview

The unified-mandala governance layer implements **fail-closed** ethical
policy evaluation on every mandala cycle.  All policy rules are expressed
as OPA-compatible predicates and evaluated before any emergence event is
acted upon.

## Policy Rules

### EntropyBounds

Ensures the raw entropy input is in the physical interval $[0, 1]$.

```python
assert 0.0 <= entropy <= 1.0
```

### CREPSanity

Ensures the CREP score is a finite float in $[0, 1]$.

```python
assert math.isfinite(crep_score) and 0.0 <= crep_score <= 1.0
```

### EmergenceRateLimit

Bounds the absolute emergence rate to prevent chaotic amplification:

$$|E(t)| \leq E_{\max}$$

Default $E_{\max} = 10.0$.

### CoherenceCollapseGuard

Blocks cycles where CREP score drops by more than the collapse threshold
in a single step (catastrophic decoherence):

$$\Delta C = C_{t-1} - C_t > \delta_{\text{collapse}}$$

Default $\delta_{\text{collapse}} = 0.5$.

### EthicalEntropy

In strict mode, refuses extreme entropy values:

- **Floor**: entropy $< 0.05$ → entropy death
- **Ceiling**: entropy $> 0.99$ → chaotic overflow

## OPA Integration

Every cycle emits an OPA-compatible JSON payload:

```json
{
  "input": {
    "entropy": 0.618,
    "crep_score": 0.821,
    "crep_emergence": true,
    "emergence_rate": 0.412,
    "emergence_constructive": true,
    "strict_ethics": true,
    "max_emergence_rate": 10.0
  }
}
```

This can be sent to `POST /v1/data/unified_mandala/policy` in a live OPA
server.

## EntropyGovernor

The `EntropyGovernor` wraps raw entropy inputs with adaptive clamping:

```python
from unified_mandala.governance.policy import EntropyGovernor

gov = EntropyGovernor(window=10, floor=0.05, ceiling=0.99)
for raw_entropy in data_stream:
    safe_entropy = gov.observe(raw_entropy)
    result = orch.run_cycle(entropy=safe_entropy)
```

Rolling statistics are available:

```python
print(gov.mean_entropy)  # rolling mean
print(gov.variance)      # variance (high = turbulent)
```

## Ethical Commitment

The unified-mandala framework is committed to:

1. **Transparency** — all policy decisions are logged and auditable
2. **Non-maleficence** — cycles that violate ethical bounds are blocked, not degraded
3. **Reproducibility** — OPA payloads are deterministic and Zenodo-archived
4. **Scientific integrity** — all formulas and derivations are cited in the reference documentation
