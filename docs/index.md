# unified-mandala

**DOI**: [10.5281/zenodo.19168056](https://doi.org/10.5281/zenodo.19168056)
**Zenodo**: [https://zenodo.org/records/19168056](https://zenodo.org/records/19168056)

**v0.1.0** — Holistic self-reflecting Mandala framework integrating CREP,
Sigillin, and the full GenesisAeon ecosystem (17 adapters).

---

## Overview

The **unified-mandala** revival package restores the full holistic Mandala
framework, providing:

- **CREP** — Coherent Resonance Emergence Protocol for real-time resonance scoring
- **Sigillin** — Poetic-symbolic field interaction layer
- **Policy Gates** — OPA-compatible ethical governance
- **17 GenesisAeon adapters** — Full integration bus for all major sub-systems
- **Typer CLI** — `unified-mandala cycle`, `reflect`, `adapters`, `validate`

## Mathematical Foundation

### CREP Formula

The CREP score aggregates weighted resonance phases across $N$ adapter channels:

$$
C(t) = \sum_{i=1}^{N} w_i \cdot \varphi_i(t) \cdot e^{-\lambda_i \Delta t}
$$

where:

| Symbol | Meaning |
|--------|---------|
| $w_i$ | adapter weight (normalised: $\sum w_i = 1$) |
| $\varphi_i(t)$ | resonance phase at time $t$ for adapter $i$ |
| $\lambda_i$ | decay constant for adapter $i$ (per second) |
| $\Delta t$ | elapsed time since last measurement |

Emergence is triggered when $C(t) \geq 0.72$.

### Sigillin Field Φ

The Sigillin field integral:

$$
\Phi = \int \rho(s,t)\,\Psi(s)\,ds
$$

is approximated via a sigmoidal mapping of the CREP score:

$$
\Phi(C) = \frac{1}{1 + e^{-12(C - 0.72)}}
$$

### Emergence Rate

$$
E(t) = \frac{d\Phi}{dt} \cdot H(S)
$$

where $H(S) = -\sum_i p_i \log_2 p_i$ is the Shannon entropy of the system state.

## Quick Example

```python
from unified_mandala.core.mandala import MandalaOrchestrator
from unified_mandala.governance.policy import PolicyGate
from unified_mandala.integrations.registry import AdapterRegistry
from unified_mandala.sigillin.bridge import SigillinBridge

orch = MandalaOrchestrator(
    registry=AdapterRegistry.discover(),
    policy_gate=PolicyGate(strict_ethics=True),
    sigillin=SigillinBridge(),
)

result = orch.run_cycle(entropy=0.618)
print(result.summary)
# Cycle 0001 | entropy=0.618 | CREP=0.821 [EMERGE] | E-rate=0.4123 | gov=PASS | glyph='◉☉'
```

## Ethical Governance

All cycles are subject to OPA-compatible policy evaluation:

- **EntropyBounds** — entropy must be in $[0, 1]$
- **CREPSanity** — score must be finite in $[0, 1]$
- **EmergenceRateLimit** — $|E(t)| \leq 10.0$
- **CoherenceCollapseGuard** — CREP drop $> 0.5$ in one step
- **EthicalEntropy** — entropy in $[0.05, 0.99]$ (strict mode)

See the [Governance](governance.md) section for full policy documentation.

## Citation

```bibtex
@software{unified_mandala_2024,
  title   = {unified-mandala: Holistic Self-Reflecting Mandala Framework},
  author  = {GenesisAeon Contributors},
  year    = {2024},
  version = {0.1.0},
  doi     = {10.5281/zenodo.unified-mandala},
  url     = {https://github.com/GenesisAeon/unified-mandala}
}
```
