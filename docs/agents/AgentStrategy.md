# Agent Strategy

Dieses Dokument fasst die Vision und strategische Ausrichtung der Agenten zusammen.

## Vision
UnifiedMandala versteht sich als symbiotisches System, in dem jeder Agent einen klaren Aufgabenbereich hat und zur ganzheitlichen Entwicklung beiträgt.

## Leitlinien
- **Modularität**: Jeder Agent ist eigenständig deploybar und kommuniziert über definierte Events.
- **Nachvollziehbarkeit**: Alle Aktionen werden in gemeinsamen Logs erfasst.
- **Tiefe & CREP**: Entscheidungen orientieren sich an Tiefewerten und CREP-Scores.
- **Poetischer Fluss**: Ergebnisse werden in `poeticCommits.md` und `GenesisChronik.md` festgehalten.

## Umsetzung
1. Konsolidierte Konfiguration in `codex-config.yaml` bereitstellen.
2. Agenten über `SyncRunner` regelmäßig synchronisieren.
3. Erweiterungen über `GenesisAeonNavigator` phasengerecht einbinden.
4. Visionen zentral über den VisionContextIntegrator abstimmen.
5. Agentenübersicht via StrategicAgentCoordinator generieren.
