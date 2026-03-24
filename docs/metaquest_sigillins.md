# MetaQuest-Sigillins

> **unified-mandala v0.3.0** — Adaptive Counterquestion Engine
> DOI: [10.5281/zenodo.19184798](https://doi.org/10.5281/zenodo.19184798)

MetaQuest-Sigillins implement an epistemic negotiation protocol for AI-to-AI
collaboration.  The engine generates *counterquestions* — targeted epistemic
probes — that steer collaborative reasoning toward high-emergence attractors
in the unified-mandala CREP landscape.

**Module:** `unified_mandala.sigillins.metaquest`

---

## 1. Architecture

```
System State
(CREP score C, Entropy H)
        │
        ▼
SigillinBridge.phi(C) → Φ ∈ [0,1]
        │
        ▼
MetaQuestEngine.select_tier(Φ, H)
        │
        ▼
┌──────────────────────────────────┐
│ T0: GROUNDING  (Φ·(1-H) < 0.25) │
│ T1: PROBING    (0.25 – 0.50)    │
│ T2: CHALLENGE  (0.50 – 0.75)    │
│ T3: SYNTHESIS  (0.75 – 1.00)    │
└──────────────────────────────────┘
        │
        ▼
CounterQuestion (text, sigil, tier, question_id)
        │
        ▼
CollaborationSession (AgentA → AgentB)
        │
        ▼
Response + convergence_score → CREP update
```

---

## 2. Tier Selection

The tier selection function maps Sigillin field $\Phi$ and entropy $H$ to
an epistemic depth tier:

$$
T(\Phi, H) = \left\lfloor \Phi \cdot (1 - H) \cdot N_T \right\rfloor \pmod{N_T}
$$

where $N_T = 4$ (four tiers).

| Tier | Name | $\Phi \cdot (1-H)$ Range | Epistemic Mode |
|---|---|---|---|
| 0 | GROUNDING | 0.00 – 0.25 | Factual anchoring, definition |
| 1 | PROBING | 0.25 – 0.50 | Mechanism, causality |
| 2 | CHALLENGE | 0.50 – 0.75 | Contradiction, assumption testing |
| 3 | SYNTHESIS | 0.75 – 1.00 | Cross-domain integration |

**Fractal singularity:** At $\Phi = 0.618$ (golden ratio) and $H = 0.382$,
$\Phi \cdot (1-H) \approx 0.382$, placing the system at the boundary
between PROBING and CHALLENGE — the most productive epistemic zone.

---

## 3. Question Libraries

Each tier maintains a curated library of 5 counterquestions, each paired
with a Sigillin glyph:

### Tier 0 — Grounding

| Sigil | Question |
|---|---|
| ⊙ | What is the ground-state entropy of this system? |
| ◌ | Define the boundary conditions for this CREP evaluation. |
| ○ | What prior assumptions anchor your current probability estimate? |
| · | Identify the conserved quantities in this thermodynamic cycle. |
| ⊙ | What is the reference steady-state distribution p_ss for this domain? |

### Tier 1 — Probing

| Sigil | Question |
|---|---|
| ∿ | How does the maintenance entropy σ_maint change under increased coupling? |
| ⟳ | What causal pathway connects CO₂ forcing to ice-albedo feedback here? |
| ⊕ | Trace the Landauer cost of each information erasure step in your reasoning. |
| ⋈ | Which adapter channel dominates the CREP score — and why? |
| ∿ | How does the Hatano-Sasa excess Σ_ex evolve if the protocol rate doubles? |

### Tier 2 — Challenge

| Sigil | Question |
|---|---|
| ⟁ | Does your model violate the Esposito non-negativity constraint on σ_reorg? |
| ⊞ | Can you construct a counter-example that falsifies this emergence claim? |
| ∞ | Is Tainter's law applicable here, or does Prigogine's minimum-entropy principle dominate? |
| ❄ | What evidence would refute the planetary albedo feedback you assumed? |
| ⌬ | Are you confusing correlation with causal forcing in the CO₂-ice coupling? |

### Tier 3 — Synthesis

| Sigil | Question |
|---|---|
| ✦ | Synthesise Landauer bounds with Tainter collapse thresholds into a unified metric. |
| ⧖ | How does the MetaQuest Φ-field integrate across Prigogine, Esposito, and Tainter? |
| ⊛ | Propose a cross-domain mapping: thermodynamic σ_reorg → social reorganisation cost. |
| Ψ | Design a Sigillin ritual that encodes the planetary IEA→CO₂→Albedo→Ice causal chain. |
| ◉ | What is the minimal SDE model that captures both collapse and dissipative-structure emergence? |

---

## 4. AI-to-AI Collaboration Protocol

### Protocol Steps

1. **Initiation:** Agent A submits a seed prompt with current entropy $H$.
2. **Selection:** MetaQuestEngine selects tier $T(\Phi, H)$ and counterquestion CQ.
3. **Exchange:** Agent B receives CQ and formulates a response.
4. **Scoring:** The exchange quality is scored as convergence $\kappa \in [0, 1]$.
5. **Update:** Both agents update their local CREP channels from $\kappa$.

### Code Example

```python
from unified_mandala.sigillins.metaquest import MetaQuestEngine
from unified_mandala.sigillin.bridge import SigillinBridge
from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel

# Current system state
ev = CREPEvaluator()
ev.add_channel(ResonanceChannel("aeon", phase=0.82, weight=2.0, decay=0.0, timestamp=0.0))
crep_result = ev.evaluate(now=0.0)

# Compute Sigillin field
bridge = SigillinBridge()
phi = bridge.phi(crep_result.score)
entropy = 1.0 - crep_result.score

# Open collaboration session
engine = MetaQuestEngine()
session = engine.open_session(
    agent_a="GenesisAeon-Alpha",
    agent_b="GenesisAeon-Beta",
    seed_prompt="Evaluate collapse risk for current system state.",
    phi=phi,
    entropy=entropy,
)

print(f"Counterquestion: {session.counterquestion}")
print(f"Tier: {session.tier.name}")

# Simulate agent B's response
session.close(
    response="The σ_reorg fraction is 42%, placing the system in the "
             "Prigogine bifurcation zone, not yet collapse-critical.",
    convergence_score=0.91,
)

print(f"Duration: {session.duration_s:.4f}s")
print(f"Convergence: {session.convergence_score:.2f}")
```

### Batch Analysis

```python
engine = MetaQuestEngine()

# Open and close 10 sessions at varying entropy levels
for i, entropy in enumerate([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95]):
    phi = 1.0 - entropy
    session = engine.open_session(
        f"A-{i}", f"B-{i}", f"Query-{i}", phi=phi, entropy=entropy
    )
    session.close(f"Response-{i}", convergence_score=phi * 0.9)

print(f"Total sessions: {engine.session_count}")
print(f"Synthesis fraction: {engine.mean_synthesis_fraction():.2%}")
```

---

## 5. Question ID — Deterministic Fingerprinting

Each `CounterQuestion` receives a deterministic 8-character hex ID derived
from its content:

$$
\text{ID} = \text{SHA-256}(\text{text} \| \Phi \| H)[:8]
$$

This enables:
- Deduplication of identical questions across sessions
- Reproducibility for logging and audit trails
- Chain-of-thought traceability in multi-agent conversations

---

## 6. Integration with Collapse Detector

MetaQuest counterquestions can be triggered by the collapse detector when
systemic tension $X \geq \phi_c = 0.618$:

```python
from unified_mandala.collapse_detector import CollapseDetector
from unified_mandala.sigillins.metaquest import MetaQuestEngine, QuestionTier

det = CollapseDetector()
traj = det.simulate(x0=0.7)
risk = det.collapse_risk(traj)

# High risk → escalate to CHALLENGE or SYNTHESIS tier
if risk > 0.6:
    engine = MetaQuestEngine()
    # Force high-tier generation by using low entropy proxy
    cq = engine.generate(phi=1.0 - risk, entropy=risk)
    print(f"Collapse risk={risk:.2f} → {cq.tier.name}: {cq.text}")
```

---

## References

- Taddeo, M., & Floridi, L. (2018). How AI can be a force for good.
  *Science*, 361(6404), 751–752. <https://doi.org/10.1126/science.aat5991>
- Floridi, L., et al. (2018). AI4People — An ethical framework for a good
  AI society. *Minds and Machines*, 28, 689–707.
  <https://doi.org/10.1007/s11023-018-9482-5>
- Sigillin Field definition: see `docs/reference.md` §4 and
  `src/unified_mandala/sigillin/bridge.py`.

---

*This document is part of unified-mandala v0.3.0.*
