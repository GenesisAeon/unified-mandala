# DevTalk77b Technical Evaluation

## Scope

- Source conversation: `[Fraktal77]` follow-up outlining environment hygiene, Windows parity tips, and MandalaMap legacy feature reactivation.
- Focus: align repository hygiene (.gitignore), document Windows-specific workflows, and re-enable the MandalaMap legacy overlays (labels, mini-map, event glow).
- References consulted: `DevTalk.txt`, MandalaMap docs, README/ONBOARDING Windows guidance, codexfeedback trackers.

## Findings & Actions

### Repository Hygiene & Local Artefacts

- `.gitignore` now covers Windows/Cypress artefacts (`Cypress/`, `*.local`, `*.cache/`, `apps/ui/public/demo/cosmic-web/`) to prevent accidental staging of local build outputs or OS-specific traces.

### MandalaMap Legacy Reactivation

- `packages/unifiedmandala-ui/components/MandalaMap.tsx` rewritten with:
  - DEV toggle via `?legacy=1` or explicit prop enabling labels, edge highlighting, mini-map overlay, and SSE-driven glow events with timer fallback.
  - Configurable props (`nodes`, `edges`, `edgeOpacity`, `glowDurationMs`, etc.) with safe defaults to keep existing imports stable.
  - Browser-safe SSE wiring (`EventSource` guarded) and fallback timer cycling nodes to surface the glow pathway even offline.
  - Hover highlighting, glow animation, and mini-map overlay for situational awareness.
- `apps/sharedream-interface/components/MandalaMap.tsx` now renders the shared component with curated fallback graph data, unlocking the dev legacy mode by default for demos.
- `packages/unifiedmandala-ui/index.ts` exports `MandalaMap` for broader reuse.

### Windows Developer Guidance

- README and `docs/ONBOARDING.md` document the PowerShell equivalent of `CI=true …` (`$env:CI = "1"; …`) and the `pnpm exec tsx` fallback when `scripts/run-dist.mjs` hits `spawnSync pnpm.cmd EINVAL` on Windows.

### MandalaMap Meta Refresh

- MandalaMap metadata (.md/.yaml/.json) bumped to Fraktal80 with updated generation timestamp to reflect the new activation pass.

## Open Items / Follow-ups

- Evaluate whether MandalaMap legacy overlays should fetch live SSE subjects from configuration instead of hard-coded defaults.
- Consider enriching codexfeedback automation to detect MandalaMap feature flag regressions via UI smoke/Cypress suites once implemented.
