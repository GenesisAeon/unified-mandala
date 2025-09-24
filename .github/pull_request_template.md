# Unified Mandala Pull Request

## Summary

- [ ] Kurzbeschreibung der Änderung(en)
- [ ] Relevante Fraktal-/DevTalk-Notizen verlinkt (falls vorhanden)

## Provenance (genau **ein** Label setzen)

- [ ] `source:human` – menschlich erstellter Code / Workflows
- [ ] `source:human-docs` – ausschließlich Dokumentation/Analysen/Artefakte
- [ ] `source:mandala-ai` – Mandala-interne Automationen (AI-Workspace, scratch/data)
- [ ] `source:external-ai` – Externe AI (z. B. Codex/GPT); nur scratch/docs/.github erlaubt

> CI schlägt fehl, wenn das gesetzte Label nicht zu den geänderten Pfaden passt.

## Plane (bitte markieren)

- [ ] CODE — Änderungen am Repository (Dateien im Repo, Tests, Workflows)
- [ ] RUNTIME — Änderungen an Laufzeit/Infra (NATS, HTTP, scratch:// Artefakte)

## Verification (relevante Punkte abhaken oder `n/a` begründen)

- [ ] `pnpm typecheck`
- [ ] `pnpm test:unit`
- [ ] `pnpm test:unit:coverage`
- [ ] `npx pyright`
- [ ] `pnpm schema:validate`
- [ ] `pnpm maps:validate`
- [ ] `pnpm repomap:build && pnpm repomap:validate`
- [ ] `pnpm policy:check`
- [ ] Weitere (siehe Kommentare)

## Two-Plane Guardrails

- [ ] Keine Dateien unter `.ai-scratch/` im Commit enthalten (Runtime-Artefakte → scratch://)
- [ ] Laufzeit-Ausgaben ausschließlich unter `scratch://` oder `data://`
- [ ] Bei Bot-PRs mindestens ein menschlicher Reviewer eingetragen

## Follow-up Notes

- [ ] Offene Punkte oder Nachfolge-Fraktale dokumentiert
- [ ] Relevante Docs (MandalaMap, Playbook, Command Catalog, Codexfeedback) aktualisiert oder Follow-up angelegt
