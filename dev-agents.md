Hinweis für Codex/Dev-Agents:
Halte stets Backend-API, Datahooks, UI-Komponenten, Storybook-Stories und Tests synchron!
Prüfe regelmäßig, ob die Datenquellen (z.B. /api/meta-scores) und die Dashboard-Komponenten konsistent und aktuell die Layer-Konfiguration abbilden. Bei jedem Commit: Test-/Doku-Referenz ergänzen!

Weitere Hinweise:

- Nutze **codex-sigil.yaml** als zentralen Arbeitsanker.
- Folge dem Ablauf in **fraktal-zyklus.md** bei der Umsetzung deiner Aufgaben.
- Feedback siehe feedbackcodex.json
- Führe `pnpm store:commit-memory` nur beim **ersten** Commit einer Sitzung aus.
  Dabei wird das Verzeichnis `GenesisAeonZIPMEM` angelegt und ein Marker `.zipmem_session` erzeugt.
  Solange diese Datei existiert, kannst du den Schritt bei weiteren Commits überspringen.
  Die `meta.yaml` enthält die eingesetzten Versionen von Node und pnpm.
- Prüfe vor jedem Lauf, ob `metacommit.yaml` oder `metacommit.json` existieren.
  Befolge vorrangig die dort hinterlegten Schritte aus `feedbackcodex.md` und
  lösche die Dateien nach Abschluss der MetaCommit-Aufgaben.
