# Changelog

Alle relevanten Änderungen dieses Projekts werden in diesem Dokument festgehalten.

## [0.1.0] - 2024-04-10

- Initiale Struktur mit Mandala-Komponenten.

## [Unreleased]

- Verfeinerte Symbolzuordnung in `aeon_processor.assign_symbol`
  für differenziertere Ausgabe.
- Neues Skript `export-depth-bundle.ts` generiert Depth-Bundle und Index.
- Bereinigt `advancedToDo.yaml` und `advancedToDo.json`; leere oder vage Aufgaben entfernt.
- Dev-Resilienz: In-Memory-Fallbacks für NATS-abhängige Dienste (`flags-api`, `experiments-api`).
- Optionales Auto-Disable von NATS via `UM_DEV_AUTODISABLE_NATS=1` im Orchestrator.
- PowerShell: `Start-UM` fällt bei fehlendem Docker/NATS automatisch auf Memory-Backends zurück.
- Alias `@config/*` eingeführt; API-Import gefixt; Tests stabilisiert.
