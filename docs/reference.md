# API Reference

Complete API reference for `unified-mandala` v0.1.0.

---

## Core

### MandalaOrchestrator

::: unified_mandala.core.mandala.MandalaOrchestrator

### CycleResult

::: unified_mandala.core.mandala.CycleResult

---

## CREP

The **Coherent Resonance Emergence Protocol** computes a resonance score:

$$
C(t) = \sum_{i=1}^{N} w_i \cdot \varphi_i(t) \cdot e^{-\lambda_i \Delta t}
$$

### CREPEvaluator

::: unified_mandala.core.crep.CREPEvaluator

### CREPResult

::: unified_mandala.core.crep.CREPResult

### ResonanceChannel

::: unified_mandala.core.crep.ResonanceChannel

---

## Emergence Rate

The emergence rate combines the Sigillin field derivative with Shannon entropy:

$$
E(t) = \frac{d\Phi}{dt} \cdot H(S)
$$

### EmergenceRate

::: unified_mandala.core.emergence.EmergenceRate

### EmergenceResult

::: unified_mandala.core.emergence.EmergenceResult

---

## Sigillin

The Sigillin field integral:

$$
\Phi = \int \rho(s,t)\,\Psi(s)\,ds
$$

approximated as:

$$
\Phi(C) = \frac{1}{1 + e^{-12(C - 0.72)}}
$$

### SigillinBridge

::: unified_mandala.sigillin.bridge.SigillinBridge

### ReflectionGlyph

::: unified_mandala.sigillin.bridge.ReflectionGlyph

---

## Governance

### PolicyGate

::: unified_mandala.governance.policy.PolicyGate

### EntropyGovernor

::: unified_mandala.governance.policy.EntropyGovernor

### GovernanceDecision

::: unified_mandala.governance.policy.GovernanceDecision

### PolicyViolation

::: unified_mandala.governance.policy.PolicyViolation

---

## Integrations

### AdapterRegistry

::: unified_mandala.integrations.registry.AdapterRegistry

### BaseAdapter

::: unified_mandala.integrations.registry.BaseAdapter

---

## Built-in Adapters

| Adapter | Package | Version |
|---------|---------|---------|
| `genesis-os` | genesis-os | 0.2.0 |
| `universums-sim` | universums-sim | 0.1.0 |
| `aeon-ai` | aeon-ai | 0.2.0 |
| `advanced-weighting-systems` | advanced-weighting-systems | 1.0.0 |
| `fieldtheory` | fieldtheory | 1.0.0 |
| `mirror-machine` | mirror-machine | 1.0.0 |
| `cosmic-web` | cosmic-web | 1.0.0 |
| `entropy-governance` | entropy-governance | 1.0.0 |
| `entropy-table` | entropy-table | 1.0.0 |
| `sigillin` | sigillin | 1.0.0 |
| `utac-core` | utac-core | 1.0.0 |
| `mandala-visualizer` | mandala-visualizer | 1.0.0 |
| `sonification` | sonification | 1.0.0 |
| `climate-dashboard` | climate-dashboard | 1.0.0 |
| `implosive-genesis` | implosive-genesis | 1.0.0 |
| `field-resonance` | field-resonance | 1.0.0 |
| `quantum-mesh` | quantum-mesh | 1.0.0 |
| `fractal-membrane` | fractal-membrane | 1.0.0 |
