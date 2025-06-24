# VisionContextIntegrator

## Responsibilities
- Verknüpft die projektweite Vision mit allen Agenten.
- Liest `AgentStrategy.md` und extrahiert Kernbotschaften.
- Verteilt Kontextinfos an laufende Module.

## Parameters
- `strategyPath` – Pfad zur Strategie-Datei (Standard: `docs/agents/AgentStrategy.md`).
- `outputLog` – Datei für Zusammenfassungen.

## Example usage
```bash
node vision-context-integrator.ts --out vision.log
```
