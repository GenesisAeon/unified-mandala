# Changelog

Alle relevanten Änderungen dieses Projekts werden in diesem Dokument festgehalten.

## [0.1.0] - 2024-04-10

- Initiale Struktur mit Mandala-Komponenten.

## [0.3.0] - 2026-03-24

### New Features

- **Thermodynamics Module** – Landauer bound (`E = k_B T ln2`), Hatano-Sasa non-equilibrium decomposition, Esposito maintenance/reorganization entropy (σ_maint + σ_reorg)
- **Planetary Coupling** – IEA→CO₂→ΔF→ΔT→Albedo→Ice→CREP chain with Systemic-Vulnerability metric
- **MetaQuest-Sigillins** – 4-tier adaptive counterquestion engine for AI-to-AI collaboration
- **Collapse Detector** – Euler-Maruyama SDE + Tainter complexity overreach + Prigogine dissipative structure indicators + φ=0.618 fractal singularity
- **NukleonScanner v2** – QCD αs running coupling + QGP confinement adapter
- **GreekMath Adapter v2** – Pythagorean tuning, golden section, Platonic solid geometry
- **CLI commands** – `unified-mandala thermodynamics`, `collapse`, `metaquest`, `planetary`
- **Docs** – `thermodynamic_anchors.md`, `planetary_resonance.md`, `metaquest_sigillins.md`
- 2344 tests @ 100 % coverage · ruff-clean · mypy-clean

## [0.3.2] - 2026-03-25

### New Features

- **NukleonScanner v2.1.0** – Two-loop QCD αs(Q) running coupling (β₁ correction) + string-tension confinement phase φ_string = exp(−σ/Q²)
- **GreekMath v2.1.0** – Logarithmic (golden-angle equiangular) spiral primitive + Fibonacci ratio proximity; 6 weighted primitives (sum=1)
- **FieldTheory v2.0.0** – Full Klein-Gordon scalar field: standing-wave amplitude, dispersion relation ω²=k²+m², Euclidean propagator Δ_E=m²/(p_E²+m²), Lagrangian density L
- **CLI commands** – `unified-mandala nukleon`, `greekmath`, `fieldtheory` with `--entropy` and `--phases` flags
- **+45 tests** – Unit + contract tests for all three adapters; adapter registry v0.3.0 test updated for v2.1.0/v2.0.0 versions

## [1.0.0] - 2026

### Added

- Ecosystem-wide GenesisAeon v1.0.0 release: standardized release tooling
  (`.zenodo.json`, GitHub Actions release workflow, `RELEASE_GUIDE.md`,
  bug/feature issue templates).
- Diamond Interface completed on `MandalaOrchestrator`: `get_crep_state`,
  `get_utac_state`, `get_phase_events`, `to_zenodo_record` (joins the
  pre-existing `run_cycle`).

### Changed

- Project metadata (`pyproject.toml`) version bumped to `1.0.0` as part of
  the ecosystem-wide milestone.

## [Unreleased]

- Merge pull request #1839 from GenesisAeon/worktree-unified-mandala-ci-fix

- Merge pull request #1838 from GenesisAeon/sealcore-mandala-map-update

- Merge pull request #1837 from GenesisAeon/sealcore-mandala-map-update

- docs: GenesisAeonAdvancedAi extracted as aeon-trikaya (P52), MIGRIERT

- docs: note kan_physics is non-functional, P53 extraction sourced from resilience-core instead

- docs: GenesisAeonAdvancedAi vs aeon-ai diff - not a duplicate

- docs: MANDALA_MAP.md - first-pass content archaeology of unified-mandala

- fix: release job's own commits were blocked by its own pre-commit hook

- **Lizenzwechsel**: Repository ist jetzt dual-lizenziert — Quellcode unter
  GPL-3.0-or-later (`LICENSE-CODE`), Dokumentation unter CC BY 4.0
  (`LICENSE-DOCS`). Vorherige Lizenz: MIT.
- Verfeinerte Symbolzuordnung in `aeon_processor.assign_symbol`
  für differenziertere Ausgabe.
- Neues Skript `export-depth-bundle.ts` generiert Depth-Bundle und Index.
- Bereinigt `advancedToDo.yaml` und `advancedToDo.json`; leere oder vage Aufgaben entfernt.
- Dev-Resilienz: In-Memory-Fallbacks für NATS-abhängige Dienste (`flags-api`, `experiments-api`).
- Optionales Auto-Disable von NATS via `UM_DEV_AUTODISABLE_NATS=1` im Orchestrator.
- PowerShell: `Start-UM` fällt bei fehlendem Docker/NATS automatisch auf Memory-Backends zurück.
- Alias `@config/*` eingeführt; API-Import gefixt; Tests stabilisiert.
