# Unified Mandala Pull Request

## Summary

- [ ] Kurzbeschreibung der Änderung(en)
- [ ] Verlinke relevante Fraktal-/DevTalk-Notizen (falls vorhanden)

## Plane (bitte markieren)

- [ ] CODE — Änderungen am Repository (Dateien im Repo, Tests, Workflows)
- [ ] RUNTIME — Änderungen an Laufzeit/Infra (NATS, HTTP, scratch:// Artefakte)

> Nutze **CODE** wenn Dateien im Repo angepasst werden. Nutze **RUNTIME** für Runtime-Deployments ohne Repo-Diff.

## Verification (mindestens die relevanten Punkte abhaken)

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

- [ ] Keine Dateien unter `.ai-scratch/` im Commit enthalten (runtime Artefakte → scratch://)
- [ ] Laufzeit-Ausgaben oder Zwischenergebnisse ausschließlich unter `scratch://` oder `data://` gespeichert
- [ ] Falls der PR durch einen Bot erstellt wurde: mindestens ein menschlicher Reviewer eingetragen

## Follow-up Notes

- [ ] Offene Punkte oder Nachfolge-Fraktale dokumentiert
- [ ] Relevante Docs (MandalaMap, Playbook, Command Catalog, Codexfeedback) aktualisiert oder Follow-up angelegt
