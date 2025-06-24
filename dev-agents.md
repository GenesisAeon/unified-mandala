Hinweis für Codex/Dev-Agents:
Halte stets Backend-API, Datahooks, UI-Komponenten, Storybook-Stories und Tests synchron!
Prüfe regelmäßig, ob die Datenquellen (z.B. /api/meta-scores) und die Dashboard-Komponenten konsistent und aktuell die Layer-Konfiguration abbilden. Bei jedem Commit: Test-/Doku-Referenz ergänzen!

Weitere Hinweise:
- Nutze **codex-sigil.yaml** als zentralen Arbeitsanker.
- Folge dem Ablauf in **fraktal-zyklus.md** bei der Umsetzung deiner Aufgaben.
- Feedback siehe feedbackcodex.json
- F\u00fchre nach jedem Commit `pnpm store:commit-memory` aus, um einen Patch
  samt `meta.yaml` im Ordner `GenesisAeonZIPMEM` abzulegen.
  Die YAML-Datei enthält nun auch die eingesetzten Versionen von Node und pnpm.
