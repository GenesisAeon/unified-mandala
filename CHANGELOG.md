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

## [Unreleased]

- Verfeinerte Symbolzuordnung in `aeon_processor.assign_symbol`
  für differenziertere Ausgabe.
- Neues Skript `export-depth-bundle.ts` generiert Depth-Bundle und Index.
- Bereinigt `advancedToDo.yaml` und `advancedToDo.json`; leere oder vage Aufgaben entfernt.
- Dev-Resilienz: In-Memory-Fallbacks für NATS-abhängige Dienste (`flags-api`, `experiments-api`).
- Optionales Auto-Disable von NATS via `UM_DEV_AUTODISABLE_NATS=1` im Orchestrator.
- PowerShell: `Start-UM` fällt bei fehlendem Docker/NATS automatisch auf Memory-Backends zurück.
- Alias `@config/*` eingeführt; API-Import gefixt; Tests stabilisiert.
