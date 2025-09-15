# UnifiedMandala Minimal Core (v1.0)

Die Konsolidierung fokussiert sich auf einen kleinen, vollständig stabilen Funktionskern. Dieses Dokument bündelt Prioritäten,
Quick Wins und Tracking-Hooks für Fraktal37 und nachfolgende Läufe.

## Leitbild
- **Stabiler Kern zuerst:** Sigillin- und CREP-Flüsse, Mandala-Agenten und das Climate-Dashboard müssen jederzeit lauffähig
  sein.
- **Experimente hinter Flags:** Alles, was noch reift, bleibt über Feature-Flags oder Test-Scopes deaktiviert, bis Stabilität
  nachgewiesen ist.
- **Iterative Sprints:** Nach jedem Mikrosprint erfolgt ein Check der Core-CI, bevor neue Themen geöffnet werden.

## Minimal Viable Core
| Capability | Beschreibung | Priorität | Status | Owner |
| --- | --- | --- | --- | --- |
| Sigillin & CREP Pipeline | Sigillin-Index, CREP-Normalisierung, Resonanz-Metriken | hoch | ✅ stabil | Codex Core |
| Agenten-Grundfunktionen | CodexAuditAgent, QualityAssuranceAgent, Mandala Sync | hoch | ✅ stabil | Agents Guild |
| Climate Dashboard | ERA5/OISST Aggregation & adapters_index.json Smoke | hoch | ⚙️ beobachten | Climate Cell |
| Mandala UI Kern | Start-/Dashboard-Ansichten, Feature-Flags im UI | mittel | ⚙️ beobachten | UI Studio |
| Observability & QA | Pyright, tsc, Vitest Core, Metrics Registry | hoch | ✅ stabil | QA Ring |

## Quick-Win Fixliste (≤ 1h)
- [x] Vitest-Scope `UM_TEST_SCOPE=core` für stabile CI eingeführt.
- [x] `pnpm test:ts:extended` in CI-Extended aufgenommen.
- [ ] ERA5 Nightly ohne `LOW_MEM` (extended job) beobachten.
- [ ] Prompt-Coach Dry-Run in Extended-Jobs protokollieren.

## Sprint-Kadenz (Vorschlag)
1. **Sprint 1 – Kern-Checks** (laufend): Core-Vitest + Pyright + tsc müssen grün sein.
2. **Sprint 2 – Adapter & STAC**: Offline-Builds weiter härten, STAC-Validierung automatisieren.
3. **Sprint 3 – Dokumentation & Onboarding**: README/ONBOARDING synchron halten, Quickstart testen.
4. **Sprint 4 – Feature-Gates & Governance**: Flags dokumentieren, Policies aktualisieren, Community informieren.

## CI Layering & Test-Scopes
- `pnpm test:ts:core`: Läuft mit `UM_TEST_SCOPE=core` und schließt alles unter `tests/smoke/**`, `tests/redteam/**` sowie
  `tests/agents/golden/**` aus.
- `pnpm test:ts:extended`: Aktiviert Extended-Suite (läuft in CI Extended).
- `pnpm test:ts:experimental`: Vollsuite inkl. experimenteller Verzeichnisse für manuelle Audits.
- Extended-Jobs werden über das Label `run-extended` oder via Nightly ausgelöst.

## Tracking-Hooks
- Fortschritt & Entscheidungen: `codexfeedback.(md|json|yaml)` → aktueller Stand Fraktal37.
- Roadmap-Updates: dieses Dokument (`docs/roadmap/minimal-core.md`).
- CI-Konfiguration: `.github/workflows/ci.core.yml` & `.github/workflows/ci.extended.yml`.
- Feature-Gates & Tests: `vitest.config.ts`, `package.json` (`test:ts:*` Skripte).

Stand: Fraktal37 – alle technischen Inhalte aus dem Konsolidierungsplan umgesetzt, weitere Punkte siehe Quick-Win-Liste.
