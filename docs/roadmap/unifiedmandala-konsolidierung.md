# Konsolidierungsplan „UnifiedMandala“ · Fraktal37

_Dieses Dokument verdichtet den integrierten Feedbacklauf aus Fraktal37 und übersetzt ihn in eine umsetzbare Roadmap. Alle Punkte sind so formuliert, dass ein kleines Kernteam (oder eine Einzelperson mit KI-Unterstützung) sie sequenziell abarbeiten kann._

## 1. Minimal Viable Core (Release 1.0)

Die folgenden Module bilden den stabilen Kern. Alles andere bleibt bis nach 1.0 hinter Feature-Flags oder wird in Extended-/Experimental-Suiten verschoben.

| Domäne | Verpflichtend für 1.0 | Guardrails |
| --- | --- | --- |
| Sigillin | Sigillin-Index + Parser + CREP-Badges im UI | `UM_FEATURE_CLIMATE_CORE=on` erzwingt Verfügbarkeit | 
| CREP-Kernel | Normalisierung, Resonanz-Berechnung, Emergenz-Indikatoren | Tests in `tests/crep.*` laufen in der Core-Suite |
| Agenten-Basis | Agent-Runtime + Health-Check + QA-Router | Feature-Flags für experimentelle Agenten (`UM_FEATURE_UNIVERSE_SIM`, `UM_FEATURE_QUANTUM`) |
| Climate Dashboard | Mandala Climate Tiles + OISST/ERA5 offline Build | STAC/Adapter-Smoke in Extended-CI |
| Observability | `ensureDefaultMetrics()` + Health-Endpunkte | `LOW_MEM` deaktiviert optionale Membrane-Metriken |

**Definition of Done für 1.0**
1. `pnpm test:ts:core`, `npx tsc -p tsconfig.json --noEmit` und `npx pyright` laufen lokal und im Core-CI grün.
2. `pnpm build:ui && pnpm dev` liefert die UI ohne Fehlermeldungen.
3. Dokumentation für Setup, Feature-Flags und Test-Suiten ist aktuell (README + CONTRIBUTING + dieses Dokument).
4. Alle kritischen Bugs sind entweder behoben oder in `codexfeedback.*`/`advancedprogress.json` als Known Issues dokumentiert.

## 2. Sprint-Planung & Priorisierung

| Sprint | Fokus | Deliverables |
| --- | --- | --- |
| **Sprint 1 · Kern-Stabilisierung (Woche 1–2)** | Core-Tests grün, Feature-Flags default-off für Experimente, Quick Wins beheben | ✅ Scripts `pnpm test:ts:core`, neue Vitest-Filter, aktualisierte `.env.example` |
| **Sprint 2 · Modularisierung (Woche 3–4)** | Adapter + STAC in Extended-CI, Aufteilung Core vs. Experimental in Code | ✅ Extended Vitest-Job, Adapter-Smoke, `docs/roadmap/...` (dieses Dokument) |
| **Sprint 3 · Dokumentation & Kultur (Woche 5–6)** | Onboarding pflegen, Governance & Feedback-Schleifen | ✅ README/CONTRIBUTING aktualisiert, `codexfeedback` erweitert |
| **Sprint 4+ · 1.0 Finalisierung** | Rest-Schulden tilgen, Release-Notes & Tag setzen | ✅ `v1.0.0` Tag + Release Notes |

**Quick Wins zuerst:**
- Failing Tests markieren oder mit `UM_TEST_SUITE=extended`/`experimental` isolieren.
- Kleinteilige Fixes (< 1h) sofort priorisieren (z. B. Erwartungswerte, veraltete Snapshots, Pfadfehler im Dev-Server).
- Ergebnisse im `codexfeedback` vermerken, damit Fraktalläufe nachvollziehbar bleiben.

## 3. CI-Layering & Test-Suiten

| Suite | GitHub Workflow | Command lokal | Zweck |
| --- | --- | --- | --- |
| **Core** | `.github/workflows/ci.core.yml` | `pnpm test:ts:core` | Pflichtlauf (Required Check). Enthält stabile Unit-/Integrationstests, tsc, pyright. |
| **Extended** | `.github/workflows/ci.extended.yml` | `pnpm test:ts:extended` | Nachtlauf oder via Label `run-extended`. Beinhaltet Adapter-Builds, STAC-Validierung, erweiterte Vitest-Suite. |
| **Experimental** | `.github/workflows/ci.experimental.yml` | `pnpm test:ts:experimental` | On-demand via Label `run-experimental`. Darf fehlschlagen (`|| true`). Enthält Agenten-Dry-Runs, Guardrails, Red-Team-Tests. |

**Vitest-Switching:**
- `UM_TEST_SUITE=core` (Default) schließt `tests/smoke/**`, `tests/redteam/**`, `*.extended.spec.ts` usw. aus.
- `UM_TEST_SUITE=extended` aktiviert langsame Tests, lässt `redteam` weiterhin aus.
- `UM_TEST_SUITE=experimental` läuft ohne Filter. Optional `LOW_MEM=0` setzen, falls mehr Ressourcen verfügbar.

## 4. Feature-Flags & Konfiguration

- Zentraler Einstieg: `src/config/featureFlags.ts`
- Flag-Namen & Defaultwerte:
  - `UM_FEATURE_CLIMATE_CORE=on`
  - `UM_FEATURE_UNIVERSE_SIM=off`
  - `UM_FEATURE_QUANTUM=off`
  - `UM_FEATURE_TELEMETRY=off`
  - UI-spezifische Flags via `VITE_FEATURE_*`
- Helper:
  - `isOn("flag")` → boolean
  - `whenFeature("flag", onValue, offValue)` → erlaubt schnelle Branches ohne Inline-`if`
- LOW_MEM (`LOW_MEM=1`) deaktiviert automatisch Membrane/Heavy-Features.

## 5. Fehlerstrategie & Risikomanagement

1. **Skip statt Blockade:** Nicht-kritische Tests mit `UM_TEST_SUITE=extended` markieren oder `describe.skip` (mit TODO-Link) nutzen, damit Core-CI grün bleibt.
2. **Rollback:** Größere Refactorings als kleine PRs mit `feature/*`-Branches. Falls ein Merge Probleme macht, auf letzten Tag/Commit zurückrollen (Release-Tags nach jedem Sprint).
3. **Monitoring:** Concurrency in allen CI-Läufen verhindert Warteschlangen und beendet alte Jobs bei Force-Pushes.
4. **Dependency-Check:** Peer-Warnungen (React, Vitest-Plugins, OpenTelemetry) sammeln → Backlog Eintrag für Sprint 4.

## 6. Dokumentation, Onboarding & Feedback

- README: Quickstart + Link auf dieses Dokument + neue Test-Kommandos.
- CONTRIBUTING: Pflicht-Checks, Label-Nutzung (`run-extended`, `run-experimental`), Hinweis auf Feature-Flags.
- `.env.example`: Neue Server-Flags + Hinweis auf `UM_TEST_SUITE`.
- Feedback-Loop: `codexfeedback.(json|md|yaml)` um Fraktalstatus zu tracken.
- Onboarding-Checkliste (monatlich wiederholen): Repo frisch klonen, Setup-Script laufen lassen, Core-Test-Suite ausführen, Dev-Server starten → Erkenntnisse dokumentieren.

## 7. Kontinuierliche Verbesserung & KI-Unterstützung

- Nach jedem Sprint: kurze Retro (Was lief gut? Was blockiert?). Ergebnisse als Issues/ToDos erfassen.
- KI-Werkzeuge gezielt einsetzen:
  - Tests generieren lassen für neu freigeschaltete Flags/Module.
  - Build-Logs analysieren (`pnpm test:ts:extended` → KI-Summary für Fehler).
  - Docs automatisch aus Code-Kommentaren erstellen (`scripts/generate-agent-docs.js`).
- Erfolg feiern: Sobald Core & Extended stabil laufen, Release Note + Blogpost/Community-Update verfassen.

---

**Status Fraktal37:** _Implementiert._ Folge-Fraktale können sich auf konkrete Module (z. B. Universe Simulation, Quantum Bridge) konzentrieren, ohne den stabilen Kern zu gefährden.
