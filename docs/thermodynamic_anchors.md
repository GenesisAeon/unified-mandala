# Thermodynamic Anchors

> **unified-mandala v0.3.0** — Documentation & Test-Offensive
> DOI: [10.5281/zenodo.19184798](https://doi.org/10.5281/zenodo.19184798)

This document provides the physical foundations for the thermodynamic
primitives integrated in v0.3.0.  All formulas are implemented in
`src/unified_mandala/thermodynamics/`.

---

## 1. Landauer Erasure Principle

**Module:** `unified_mandala.thermodynamics.landauer`

The Landauer principle (1961) establishes a fundamental lower bound on energy
dissipation when erasing one bit of classical information:

$$
E_{\text{Landauer}} = k_B T \ln 2 \approx 2.87 \times 10^{-21}\,\text{J}
\quad (T = 300\,\text{K})
$$

The corresponding entropy production is:

$$
\Delta S_{\min} = k_B \ln 2
$$

### Significance for unified-mandala

Every CREP evaluation implicitly erases information about previous system
states.  The number of bits erased per cycle scales with the *uncertainty
reduction*:

$$
n_{\text{bits}} = -\log_2 C(t)
$$

where $C(t)$ is the CREP score.  High-coherence states ($C \to 1$) erase
fewer bits; low-coherence states ($C \to 0$) incur maximum Landauer cost.

### Code Example

```python
from unified_mandala.thermodynamics.landauer import LandauerBound, landauer_energy

# Room-temperature Landauer bound
lb = LandauerBound.compute(temperature_K=300.0, n_bits=1.0)
print(f"E_min = {lb.energy_J:.3e} J")
print(f"E_min = {lb.energy_eV:.3e} eV")
print(f"E_min = {lb.energy_kT:.4f} k_B T")

# At CREP score C = 0.72 (emergence threshold)
n_bits = -__import__('math').log2(0.72)
e_emergence = landauer_energy(300.0, n_bits=n_bits)
print(f"Landauer cost at emergence: {e_emergence:.3e} J")
```

### References

- Landauer, R. (1961). Irreversibility and heat generation in the computing
  process. *IBM Journal of Research and Development*, 5(3), 183–191.
  <https://doi.org/10.1147/rd.53.0183>
- Bérut, A., et al. (2012). Experimental verification of Landauer's principle.
  *Nature*, 483, 187–189. <https://doi.org/10.1038/nature10872>

---

## 2. Hatano-Sasa Entropy Production

**Module:** `unified_mandala.thermodynamics.hatano_sasa`

For Langevin systems driven away from equilibrium by a time-varying protocol
$\lambda(t)$, the Hatano-Sasa relation decomposes entropy production into:

$$
\sigma_{\text{tot}} = \sigma_{\text{hk}} + \sigma_{\text{ex}}
$$

The **excess** (Hatano-Sasa) entropy production is:

$$
\Sigma_{\text{ex}} = -\int_0^\tau \dot{\lambda}(t)\,
\partial_\lambda \ln p_{ss}(x(t), \lambda(t))\,dt
$$

It satisfies the integral fluctuation theorem:

$$
\langle e^{-\Sigma_{\text{ex}}} \rangle = 1
$$

This is a generalisation of the Jarzynski equality to systems with
non-equilibrium steady states.

### Significance for unified-mandala

The CREP protocol $\lambda(t) = C(t)$ changes in every cycle.  The excess
entropy production $\Sigma_{\text{ex}}$ quantifies how far the system is
from its quasi-static steady state — directly linked to the collapse risk
computed by `CollapseDetector`.

### Code Example

```python
from unified_mandala.thermodynamics.hatano_sasa import (
    HatanoSasaProduction,
    TrajectorySegment,
    integral_fluctuation_check,
)

# Define trajectory segments
segments = [
    TrajectorySegment(x=0.5, lam=1.0, lam_dot=0.2, d_ln_pss_dlam=-1.5, dt=0.01)
    for _ in range(100)
]

# Compute Hatano-Sasa production
hsp = HatanoSasaProduction.from_segments(segments, sigma_hk=0.1)
print(f"σ_ex  = {hsp.sigma_ex:.4f}")
print(f"σ_hk  = {hsp.sigma_hk:.4f}")
print(f"σ_tot = {hsp.sigma_tot:.4f}")
print(f"Second law satisfied: {hsp.second_law_satisfied}")

# Simulate via Gaussian process (Euler-Maruyama)
hsp_sim = HatanoSasaProduction.from_gaussian_process(
    n_steps=1000,
    drift_fn=lambda x: -0.5 * x,
    diffusion=0.1,
    dt=0.01,
    seed=42,
)
print(f"Simulated σ_ex = {hsp_sim.sigma_ex:.4f}")
```

### References

- Hatano, T., & Sasa, S. (2001). Steady-state thermodynamics of Langevin
  systems. *Physical Review Letters*, 86(16), 3463–3466.
  <https://doi.org/10.1103/PhysRevLett.86.3463>
- Speck, T., & Seifert, U. (2005). Integral fluctuation theorem for the
  housekeeping heat. *Journal of Physics A*, 38(34), L581–L588.
  <https://doi.org/10.1088/0305-4470/38/34/L03>

---

## 3. Esposito-Van den Broeck Decomposition

**Module:** `unified_mandala.thermodynamics.esposito`

Esposito & Van den Broeck (2010) identified three faces of the second law.
For bipartite systems, the physically transparent split is:

$$
\sigma_{\text{tot}} = \sigma_{\text{maint}} + \sigma_{\text{reorg}} \geq 0
$$

| Component | Name | Physics |
|---|---|---|
| $\sigma_{\text{maint}}$ | Maintenance | Sustained by steady-state probability currents (Prigogine minimum entropy) |
| $\sigma_{\text{reorg}}$ | Reorganisation | Dissipated during structural phase transitions (Tainter complexity jumps) |

Both components are individually non-negative, satisfying the second law.

### Prigogine Dissipative Structures

Prigogine (1978) showed that systems far from equilibrium can spontaneously
self-organise into **dissipative structures** — ordered, energy-dissipating
patterns maintained by continuous entropy export to the environment.

The critical condition for dissipative structure formation:

$$
\sigma_{\text{reorg}} > \sigma_{\text{maint}}
\quad \Longleftrightarrow \quad
\text{EntropyDecomposition.dissipative\_structure\_forming} = \text{True}
$$

### Tainter's Law

Joseph Tainter (1988) observed that societies invest in complexity to solve
problems.  As complexity $C$ grows, marginal returns diminish:

$$
\frac{\partial(\text{yield})}{\partial C} \searrow 0
$$

When maintenance cost exceeds marginal return, $\sigma_{\text{reorg}}$ dominates
and the system approaches collapse.

### Code Example

```python
from unified_mandala.thermodynamics.esposito import EspositoDecomposition

# Prigogine rates (thermodynamic forces × currents)
affinities = [1.5, 0.8, -0.3]
currents   = [0.4, 0.6,  0.5]
result = EspositoDecomposition.from_prigogine_rates(affinities, currents)
print(f"σ_maint = {result.sigma_maint:.4f}")
print(f"σ_reorg = {result.sigma_reorg:.4f}")
print(f"Near equilibrium: {result.near_equilibrium}")
print(f"Dissipative structure forming: {result.dissipative_structure_forming}")

# Tainter complexity collapse
tainter = EspositoDecomposition.tainter_decomposition(
    complexity=10.0,
    marginal_return=0.2,
    maintenance_cost_rate=1.5,
)
print(f"\nTainter regime:")
print(f"  σ_reorg / σ_tot = {tainter.reorg_fraction:.2%}")
print(f"  Collapse precursor: {tainter.dissipative_structure_forming}")
```

### References

- Esposito, M., & Van den Broeck, C. (2010). Three faces of the second law.
  *Physical Review E*, 82(1), 011143.
  <https://doi.org/10.1103/PhysRevE.82.011143>
- Prigogine, I. (1978). Time, structure, and fluctuations. *Science*,
  201(4358), 777–785. <https://doi.org/10.1126/science.201.4358.777>
- Tainter, J. A. (1988). *The Collapse of Complex Societies*.
  Cambridge University Press. ISBN 978-0-521-38673-9.

---

## 4. Thermodynamics × CREP Integration

All thermodynamic modules are wired into the unified-mandala CREP pipeline:

```python
from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
from unified_mandala.thermodynamics.landauer import LandauerBound
from unified_mandala.thermodynamics.esposito import EspositoDecomposition
from unified_mandala.collapse_detector import CollapseDetector

# Step 1: CREP evaluation
ev = CREPEvaluator()
ev.add_channel(ResonanceChannel("genesis", phase=0.75, weight=2.0, decay=0.0, timestamp=0.0))
crep = ev.evaluate(now=0.0)

# Step 2: Landauer cost at current CREP state
import math
n_bits = 1.0 - crep.score
lb = LandauerBound.compute(300.0, n_bits=n_bits)

# Step 3: Esposito-Tainter collapse risk
tainter = EspositoDecomposition.tainter_decomposition(
    complexity=8.0, marginal_return=crep.score, maintenance_cost_rate=1.2
)

# Step 4: Collapse detection
det = CollapseDetector()
x0 = det.systemic_tension_from_crep(crep.score, entropy=n_bits)
traj = det.simulate(x0=x0)
risk = det.collapse_risk(traj)

print(f"CREP score:      {crep.score:.4f}")
print(f"Landauer cost:   {lb.energy_J:.3e} J")
print(f"Reorg fraction:  {tainter.reorg_fraction:.2%}")
print(f"Collapse risk:   {risk:.4f}")
```

---

*This document is part of unified-mandala v0.3.0.
Generated for DOI: [10.5281/zenodo.19184798](https://doi.org/10.5281/zenodo.19184798)*
