# Planetary Resonance

> **unified-mandala v0.3.0** — Planetary Coupling Integration
> DOI: [10.5281/zenodo.19184798](https://doi.org/10.5281/zenodo.19184798)

The planetary resonance module connects Earth-system thermodynamics to the
unified-mandala CREP framework, providing a physically-grounded
*planetary stress* channel derived from IEA energy data.

**Module:** `unified_mandala.planetary.coupling`
**Adapter:** `unified_mandala.integrations.adapters.planetary_coupling_adapter`

---

## 1. Causal Chain Architecture

The complete causal chain:

```
IEA Primary Energy [EJ/yr]
        │
        ▼  carbon intensity (56 kg CO₂/GJ)
CO₂ concentration [ppm]
        │
        ▼  Myhre et al. (1998) logarithmic forcing
Radiative Forcing ΔF [W m⁻²]
        │
        ▼  equilibrium climate sensitivity (ECS = 3 K/doubling)
Temperature anomaly ΔT [K]
        │
        ▼  linear ice-volume response
Ice volume V [10³ km³]
        │
        ▼  area-weighted albedo blend
Surface albedo α
        │
        ▼  inversion to CREP phase
Planetary CREP phase ∈ [0, 1]
```

---

## 2. Radiative Forcing

The Myhre et al. (1998) formula for CO₂ radiative forcing:

$$
\Delta F = 5.35 \ln\!\left(\frac{C}{C_0}\right) \quad [\text{W m}^{-2}]
$$

where $C_0 = 278\,\text{ppm}$ (pre-industrial) and $C$ is the current
atmospheric CO₂ concentration.

**Key values:**

| CO₂ [ppm] | ΔF [W m⁻²] | ΔT [K] |
|---|---|---|
| 278 (pre-industrial) | 0.00 | 0.00 |
| 350 | 1.28 | 0.69 |
| 421 (2024) | 2.15 | 1.17 |
| 560 (2×CO₂) | 3.71 | 2.01 |
| 700 | 5.30 | 2.87 |

### Code Example

```python
from unified_mandala.planetary.coupling import RadiativeForcing, co2_forcing_W_per_m2

# 2024 CO₂ level
rf = RadiativeForcing.compute(co2_ppm=421.0)
print(f"ΔF  = {rf.forcing_W_per_m2:.2f} W m⁻²")
print(f"ΔT  = {rf.delta_T_K:.2f} K")
print(f"2×CO₂ reached: {rf.doubled_co2}")
```

---

## 3. Ice-Albedo Feedback

The positive ice-albedo feedback amplifies warming:

$$
V = \max\!\left(0,\; V_{\text{ref}} + s \cdot \Delta T\right)
\quad s = -2500\,\text{km}^3\,\text{K}^{-1}
$$

$$
\alpha = \alpha_{\text{ocean}} + (\alpha_{\text{ice}} - \alpha_{\text{ocean}})
         \cdot \frac{V}{V_{\text{ref}}}
$$

With $\alpha_{\text{ocean}} = 0.06$, $\alpha_{\text{ice}} = 0.80$,
$V_{\text{ref}} = 26{,}500\,\text{km}^3$.

The feedback strength:

$$
\frac{\partial\alpha}{\partial T} = \frac{s}{V_{\text{ref}}}
(\alpha_{\text{ice}} - \alpha_{\text{ocean}}) < 0
$$

A negative $\partial\alpha/\partial T$ is a **positive** climate feedback —
less ice reduces albedo, causing further warming.

### Code Example

```python
from unified_mandala.planetary.coupling import IceAlbedoFeedback

for dT in [0.0, 1.0, 2.0, 3.0, 5.0]:
    ice = IceAlbedoFeedback.compute(dT)
    print(
        f"ΔT={dT:.0f}K: V={ice.ice_volume_1000km3:.0f} km³, "
        f"α={ice.surface_albedo:.3f}"
    )
```

---

## 4. IEA Energy → CO₂ Conversion

Global primary energy consumption (IEA) is converted to CO₂ accumulation
using a mean carbon intensity:

$$
\Delta[\text{CO}_2] \approx \frac{E_{\text{EJ}} \times 10^9 \times I_c}{M_{\text{air}}/M_{\text{CO}_2}}
\times \frac{1}{m_{\text{atm}}} \times 10^6 \;\text{[ppm]}
$$

where $I_c = 56\,\text{kg\,CO}_2\,\text{GJ}^{-1}$ is the global average
carbon intensity (IEA, 2023).

**Note:** This is an *upper bound* — the actual airborne fraction is ~45 %.
For calibrated projections, apply the airborne fraction correction.

### Code Example

```python
from unified_mandala.planetary.coupling import iea_to_co2_ppm

# IEA 2024: ~620 EJ/yr primary energy
co2 = iea_to_co2_ppm(energy_EJ=620.0, baseline_co2_ppm=421.0)
print(f"CO₂ after one year at 620 EJ: {co2:.2f} ppm")
```

---

## 5. CREP Phase Mapping

The planetary CREP phase maps albedo to a resonance stress indicator:

$$
\phi_{\text{planet}} = 1 - \frac{\alpha - \alpha_{\text{ocean}}}{\alpha_{\text{ice}} - \alpha_{\text{ocean}}} \in [0, 1]
$$

| $\phi_{\text{planet}}$ | Ice coverage | Stress level |
|---|---|---|
| 0.0 – 0.29 | Full ice (cold) | stable |
| 0.30 – 0.59 | Partial ice | elevated |
| 0.60 – 0.79 | Low ice | critical |
| 0.80 – 1.00 | Ice-free (warm) | extreme |

High $\phi_{\text{planet}}$ (ice-free, warm) elevates the CREP score,
triggering emergence or collapse detection.

### Full Chain Example

```python
from unified_mandala.planetary.coupling import PlanetaryCouplingChain

# Evaluate at IEA 2024 energy level
chain = PlanetaryCouplingChain.evaluate(
    energy_EJ=620.0,
    baseline_co2_ppm=421.0,
)

print(f"Energy:      {chain.energy_EJ:.0f} EJ/yr")
print(f"CO₂:         {chain.co2_ppm:.1f} ppm")
print(f"ΔF:          {chain.forcing.forcing_W_per_m2:.2f} W m⁻²")
print(f"ΔT:          {chain.forcing.delta_T_K:.2f} K")
print(f"Ice volume:  {chain.ice_albedo.ice_volume_1000km3:.0f} × 10³ km³")
print(f"Albedo:      {chain.ice_albedo.surface_albedo:.3f}")
print(f"CREP phase:  {chain.crep_phase:.4f}")
print(f"Stress:      {chain.stress_level}")
```

---

## 6. Planetary Adapter in CREP Pipeline

The `PlanetaryCouplingAdapter` is auto-discovered and integrated into the
adapter registry (weight = 1.8):

```python
from unified_mandala.integrations.registry import AdapterRegistry

registry = AdapterRegistry.discover()
adapter = registry.get("planetary-coupling")
state = adapter.gather(entropy=0.72, phases=7)
print(state)
# {'phase': 0.xx, 'weight': 1.8, 'co2_ppm': ..., 'stress_level': '...'}
```

---

## References

- IEA (2024). *World Energy Outlook 2024*. International Energy Agency.
  <https://www.iea.org/reports/world-energy-outlook-2024>
- Myhre, G., et al. (1998). New estimates of radiative forcing due to well-mixed
  greenhouse gases. *Geophysical Research Letters*, 25(14), 2715–2718.
  <https://doi.org/10.1029/98GL01908>
- IPCC AR6 WG1 (2021). *The Physical Science Basis*, Chapter 7.
  <https://www.ipcc.ch/report/ar6/wg1/>
- Budyko, M. I. (1969). The effect of solar radiation variations on the climate
  of the Earth. *Tellus*, 21(5), 611–619.
  <https://doi.org/10.3402/tellusa.v21i5.10109>

---

*This document is part of unified-mandala v0.3.0.*
