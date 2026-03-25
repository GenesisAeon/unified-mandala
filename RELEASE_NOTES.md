# Mandala Release Notes

_Generated via tools/release/notes2.mjs_

## v0.3.2 – 2026-03-25

Reactivation patch: NukleonScanner v2.1.0 + GreekMath v2.1.0 + FieldTheory v2.0.0 with full QFT physics.

### Adapter Upgrades
- **NukleonScanner v2.1.0** – Two-loop QCD running coupling αs(Q) with β₁ correction; string-tension confinement channel φ_string = exp(−σ_string/Q²); σ_string ≈ 0.18 GeV²; new output keys: `string_phase`, `sigma_string_gev2`
- **GreekMath v2.1.0** – Added logarithmic (golden-angle equiangular) spiral primitive and Fibonacci ratio proximity primitive; 6 primitives, weights sum to 1.0; new output keys: `logarithmic`, `fibonacci`
- **FieldTheory v2.0.0** – Full Klein-Gordon scalar field (m = 0.135 GeV, k = π); standing-wave amplitude, on-shell dispersion resonance, Euclidean Feynman propagator Δ_E, Lagrangian density; all with scientific references (Peskin-Schroeder, Srednicki, Zee)

### CLI
- `unified-mandala nukleon --entropy 0.618 --phases 7`
- `unified-mandala greekmath --entropy 0.618 --phases 7`
- `unified-mandala fieldtheory --entropy 0.618 --phases 7`

### Tests
- +45 unit and contract tests across `test_nukleonscanner.py`, `test_greekmath.py`, `test_fieldtheory.py`
- Adapter registry contract tests updated for v2.1.0/v2.0.0

### Stats
- ruff-clean · mypy-clean · 100 % English
- Built with `diamond-setup --template genesis`

## v0.3.0 – 2026-03-24

Thermodynamische + planetare Integration mit MetaQuest-Sigillins, Collapse-Detector und reaktivierten Adaptern.

### Neue Core Features
- **Thermodynamics Module** – Landauer-Bound, Hatano-Sasa, Esposito-Decomposition (maintenance vs. reorganization)
- **Planetary Coupling** – IEA→CO₂→ΔF→Albedo→Ice-Kette + SV-Metrik
- **MetaQuest-Sigillins** – adaptive Counterquestion-Engine + AI-to-AI-Kollaboration
- **Collapse Detector** – Euler-Maruyama SDE + Systemic Tension + φ = 0.618 Fraktalsingularität
- **Reactivated Adapters** – nukleonscanner (QCD αs) + greekmath (Pythagorean/Golden/Platonic) v2.0.0
- **CLI** – `unified-mandala thermodynamics`, `collapse`, `metaquest`, `planetary`

### Docs
- `thermodynamic_anchors.md`
- `planetary_resonance.md`
- `metaquest_sigillins.md`

### Stats
- 2344 tests @ 100 % coverage
- ruff-clean · mypy-clean
- Built with `diamond-setup --template genesis`
