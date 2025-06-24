# Agent System Overview

UnifiedMandala orchestrates several agents that communicate via CREP and symbolic links. 
Jeder Agent folgt dem Mandala-Prinzip: Beobachten, Bewerten, Reagieren.
Die folgende Kette zeigt den üblichen Ablauf:

```mermaid
graph TD
  FragmentMapper --> CodexAuditAgent
  CodexAuditAgent --> EvolverGPT
  EvolverGPT --> SyncRunner
  SyncRunner --> PactDepthGatekeeper
  PactDepthGatekeeper --> DepthBundleExporter
  PatternReactivator -.-> FragmentMapper
  GenesisAeonNavigator -.-> EvolverGPT
```

Weitere Agenten wie `PatternReactivator` und `GenesisAeonNavigator` arbeiten parallel zur Kette und
- **StrategicAgentCoordinator** synchronisiert die Agentenliste.
überwachen CREP-Scores sowie Phasenwechsel.

- **FragmentMapper** sammelt Gesprächsfragmente und erzeugt Aufgaben.
- **CodexAuditAgent** bewertet Tiefe und weist Sigillin zu.
- **EvolverGPT** erkundet alternative Branches und schreibt poetische Commits.
- **SyncRunner** gleicht CREP-Zustände zwischen Agenten ab.
- **PactDepthGatekeeper** erzwingt zugriffsbeschränkende Tiefenregeln.
- **DepthBundleExporter** erstellt Visualisierungen der Tiefendaten.
- **PatternReactivator** weckt ruhende Aufgabenketten bei niedrigen Scores.
- **GenesisAeonNavigator** steuert die Phasen des Gesamtprojekts.
- **StrategicAgentCoordinator** synchronisiert die Agentenliste.

Dieses Dokument verknüpft die Agentenlogik und dient als Einstiegspunkt für eigene Erweiterungen.

## Strategy
- Konsolidierte Konfiguration über `codex-config.yaml`
- Gemeinsame Logging-Schnittstellen für Nachvollziehbarkeit
- Regelmäßige Sync-Zyklen via `SyncRunner` automatisieren
- Phasenwechsel transparent über `GenesisAeonNavigator` steuern
