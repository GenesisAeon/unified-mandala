# Agent Mapping Blueprint

Dieses Dokument fasst die Beziehung zwischen den wichtigsten UI-Modulen und den zugehörigen Agenten zusammen. Grundlage sind die Gespräche aus dem Sigil-Übergang.

## UI Komponenten
- **PyramidView** – visualisiert die CREP-Pyramide und spiegelt Symbolzeit.
- **AgentHeatmap** – zeigt aktuelle Agenten-Aktivität.
- **MetricsDashboard** – fasst CREP- und Sigillin-Metriken zusammen.

## Agenten
- **CodexNavigatorAgent** – steuert Pfadwechsel anhand der Sigillin-Konfiguration.
- **QualityAssuranceAgent** – prüft Tests und Linting-Ergebnisse.
- **PatternReactivator** – reaktiviert Muster bei niedrigem CREP.

## Beziehungen
| UI Modul | Agent | Zweck |
|----------|-------|-------|
| `PyramidView` | `GenesisAeonNavigator` | Phase-Wechsel über CREP-Werte |
| `AgentHeatmap` | `AgentCoordinator` | Priorisierung laufender Agenten |
| `MetricsDashboard` | `DepthBundleExporter` | Exportiert Sigillin- und CREP-Daten |

Weitere Details finden sich in den Gesprächen "Aeon - Sigil Übergang und Kontext".
