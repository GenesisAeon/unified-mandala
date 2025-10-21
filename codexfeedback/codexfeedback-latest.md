# Codexfeedback – Fraktal 114 Command Catalog Fix

- Phase: Command Catalog Cleanup
- Status: Command Catalog-Markdown ist wieder auf dem kanonischen Stand; `pnpm opa:test` bleibt der einzige neue Eintrag.
- Next Hook: Optional `pnpm meta:mandala:sync` für MandalaMap-Parität ausführen; OPA-Bundle-/Alertmanager-Doku bleibt als Folgearbeit bestehen.
  What changed
- `docs/runbooks/command-catalog.md` wurde auf den Zustand vor der Formatierung zurückgesetzt und enthält weiterhin die Zeile für `pnpm opa:test`.
- `codexfeedback.*` und die Latest-Artefakte spiegeln die Bereinigung und den optionalen MandalaMap-Sync-Hinweis wider.
  Validate
- docs-only update; keine automatisierten Tests erforderlich.
