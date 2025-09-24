## Summary

- [ ] Kurzbeschreibung der Änderungen
- [ ] Relevante Fraktal-/DevTalk-Referenzen

## Provenance (choose ONE & apply label)

- [ ] source:human — human-authored code
- [ ] source:human-docs — human-authored docs/metadata only
- [ ] source:mandala-ai — internal Mandala automation
- [ ] source:external-ai — external AI contribution (Codex/GPT, etc.)

> CI fails if the label does not match the changed paths.

## Scope Check

- [ ] Keine Änderungen an geschützten Bereichen ohne `source:human`
  - `packages/*/core/**`, `.github/workflows/*guard*`, `scripts/ci/*guard*`, `infra/prod/**`, `deploy/**`

## Verification (mark relevant)

- [ ] `pnpm typecheck`
- [ ] `pnpm test:unit`
- [ ] `npx pyright`
- [ ] `pnpm policy:check`
- [ ] `pnpm schema:validate`
- [ ] `pnpm maps:validate`
- [ ] `pnpm repomap:build && pnpm repomap:validate`
- [ ] weitere Checks (siehe Kommentare)

## Notes

- Follow-up Aufgaben & Dokumentations-Updates (MandalaMap, Command Catalog, Playbook, Codexfeedback) verlinken oder als TODO erfassen.
