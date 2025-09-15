# Konsolidierungsplan „UnifiedMandala“ – Technische Umsetzung

Der Plan konsolidiert die im Fraktal37-Gespräch definierten Schritte. Ziel ist es, die Kernfunktionen kurzfristig zu stabilisieren und gleichzeitig einen klaren Pfad für Erweiterungen zu lassen. Dieses Dokument dient als operative Referenz für das Entwicklungsteam.

## 1. Minimal Viable Core (v1.0)
Die folgenden Funktionsblöcke müssen stabil und CI-grün sein, bevor neue Features aufgenommen werden:

1. **Sigillin Engine** – Laden, Validieren und Ausspielen der Sigillin-Bundles (`pnpm sigils:index`).
2. **CREP-Kernel** – Kernmetriken (Coherence, Resonance, Emergence, Poetics) inklusive Resonanz-Badges und Normalisierung.
3. **Agenten-Grundfunktionen** – Health-/Heartbeat-Endpunkte, Basis-Governance (`agents:health`, `agents:metrics`).
4. **Climate Dashboard** – ERA5/OISST Offlinesets inklusive `adapters_index.json` Smoke.
5. **Observability-Grundlage** – `ensureDefaultMetrics` + Prometheus-Exports (keine Doppel-Registrierungen).

> **Definition of Done:** Alle Module laufen offline, Tests in `ci.core.yml` sind grün, README/Onboarding spiegeln den Stand wider.

## 2. Quick Wins (≤ 1h) & Notfallmaßnahmen
- **CI-Basics reparieren:** offensichtliche Tippfehler/Snapshots korrigieren, fehlende Fixtures aktualisieren.
- **Test-Skip-Mechanismus:** Instabile Tests markieren (`UM_ENABLE_EXTENDED_TESTS`) statt CI zu blockieren.
- **Dev-Server-Robustheit:** UI-Builds automatisch finden (`scripts/dev-server.ts`), Windows-Hinweise loggen.
- **Dokumentation:** README-Hinweis auf `pnpm ci:core`, Pfade und Windows-Umgebung.
- **Temporäre Isolation:** Flaky Tests mit `test.skip`/Markers versehen und in `consolidationPlan.riskRegister` dokumentieren.

## 3. CI-Schichten & Workflows
| Ebene | Zweck | Trigger | Inhalt |
|-------|-------|---------|--------|
| **Core** | Pflicht für jeden PR | `ci.core.yml` | `pnpm ci:core` (tsc + Vitest Core + Pyright) |
| **Extended** | Tiefergehende Checks | Label `run-extended`, Nightly | `pnpm test:ts:extended`, `pnpm test:py`, Adapter-Builds |
| **Experimental** | Explorative Features | Label `run-experimental` | Agents Dry-Run, Guardrails, optionale Reports |

**Branch-Protection:** Nur Core-Jobs sind „required“. Extended/Experimental liefern Artefakte und Logs, blockieren aber nicht.

## 4. Sprint-Kadenz
- **Sprint 1 – Kern stabilisieren (Woche 1–2):** Fokus auf Minimal Core + Quick Wins. Deliverables: CI-Core grün, README aktualisiert.
- **Sprint 2 – Modularisierung (Woche 3–4):** Feature-Flags ausbauen, Module zwischen `core/` und `experimental/` trennen, Abhängigkeiten auditieren.
- **Sprint 3 – Dokumentations-Offensive (Woche 5–6):** CONTRIBUTING/Onboarding aktualisieren, Setup-Pfade testen (Windows/Linux/Mac), bekannte Issues pflegen.
- **Sprint 4 – Kultur & Governance (Woche 7+):** Reviews standardisieren, Community-Feedback integrieren, Extended-CI auf Zeitplan bringen.

Jeder Sprint endet mit einer Retro: **Was war blockierend?** → Maßnahmen ins Risk-Register oder Backlog übertragen.

## 5. Risiko-Register & Rollback
| Risiko | Wirkung | Gegenmaßnahme | Status |
|--------|---------|---------------|--------|
| Verdeckte Kopplungen zwischen Core/Experimental | Build-Fehler nach Refactoring | Feature-Flag + Interface-Stubs, Contract-Tests | watch |
| Lauffähigkeit auf Windows | Dev-Server/Paths fehlschlagen | Auto-Erkennung + README-Hinweise (UI_DIST) | mitigated |
| Lange Vitest-Laufzeiten | Entwickler meiden Tests | Core/Extended-Splitting + Cache + `UM_ENABLE_EXTENDED_TESTS` | active |
| Adapter-Datenzugriff offline | Tests benötigen Internet | Synthetic Fixtures + `OFFLINE=1` Standard | active |
| Einzelperson-Überlastung | Verzögerungen | Aufgabenlimit, Priorisierung dokumentieren, Community einbinden | watch |

Rollback-Regel: Große Refactorings nur in Themen-Branches; Merge erst nach grünem Core-CI. Vor Merge Tag `pre-refactor` setzen.

## 6. Dokumentation & Onboarding
- README mit Core/Extended-Hinweisen, Windows-Setup und direkten Kommandos aktualisieren.
- `docs/Konsolidierungsplan-UnifiedMandala.md` als Referenz in `CONSCIOUS_CI.md` und `advancedprogress.json` verlinken.
- Onboarding-Checkliste: Repo frisch klonen, `pnpm install`, `pnpm ci:core`, UI bauen → dokumentierte Stolpersteine sofort einpflegen.
- Known-Issues-Liste in `consolidationPlan.riskRegister` pflegen.

## 7. Kultur, Kommunikation & KI-Unterstützung
- Weekly Async-Update (Issue-Thread/Discussion) zu Fortschritt + Risiken.
- Feature-Vorschläge zuerst als Issue mit Flag-Zuordnung.
- KI-Co-Pilot nutzen für Tests, Refactorings und Doku-Entwürfe; Entscheidungen im PR begründen.
- Celebrate Wins: Core-CI grün → kurze Notiz im Changelog/Discussion posten.

## 8. Monitoring & Checkliste
- [ ] Core-CI 5 Läufe in Folge grün.
- [ ] Extended-Jobs laufen mind. 1× pro Woche (Label oder Cron).
- [ ] README/CONTRIBUTING spiegeln Flag-/CI-Setup.
- [ ] `advancedprogress.json` → `consolidationPlan` gepflegt (Status, Risiken aktualisiert).
- [ ] Release Notes v1.0 entwerfen, sobald oben erfüllt.

> **Nächste Schritte:**
> 1. Quick-Wins-Liste täglich prüfen, Status im Risk-Register ergänzen.
> 2. Sprint 1 am Fraktal-Board abhaken, bevor neue Features gemerged werden.
> 3. Community nach Feedback zur neuen CI-Schichtung fragen.

