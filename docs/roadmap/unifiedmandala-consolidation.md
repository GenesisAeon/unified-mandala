# UnifiedMandala Konsolidierungsfahrplan · Fraktal37

Dieser Fahrplan bündelt die technischen Entscheidungen aus Fraktal37 und konkretisiert, wie die Konsolidierung des Repos Schritt für Schritt umgesetzt wird. Er dient gleichzeitig als Referenz für das Kernteam und als Onboarding-Dokument für Unterstützer:innen.

## Minimal Viable Core (v1.0 Fokus)

Die folgenden Domänen werden als "muss stabil" priorisiert. Alles andere bleibt hinter Feature-Flags oder in den Extended-Suites deaktiviert.

1. **Sigillin / Symbolische Basis** – `scripts/sigils-*`, STAC/Resonanz-Berechnung und der Index müssen fehlerfrei bauen.
2. **CREP-Logik** – Kernfunktionen zur Kohärenzbewertung (`src/adapters/**/crep_score*`, `crep.resonance.test.ts`).
3. **Agenten-Grundfunktionen** – Mandala-Agenten, Governance- und Policy-Checks (`agents`, `policies`, `pact-depth` Tests).
4. **Climate Dashboard / Mandala UI** – Build- und Dev-Server (`scripts/dev-server.ts`, `apps/mandala-ui`), inklusive der Kern-Kacheln für Climate & Archive.
5. **Ingest-Pipelines** – OISST & ERA5 Offline-Builds (`pnpm adapter:build:*`) als Datengrundlage für Simulationen.

## Quick Wins (bereits umgesetzt)

- **Vitest-Filter** für Core/Extended/Experimental (`vitest.config.ts`).
- **pytest-Marker** für `slow`/`experimental` plus neue NPM-Skripte (`package.json`).
- **CI Core** erweitert um Python-Setup & `pnpm test:py` (`.github/workflows/ci.core.yml`).
- **CI Extended** führt die erweiterten Suites (`pnpm test:ts:extended`, `pnpm test:py:extended`).
- **Dokumentation** aktualisiert (`README.md`, `CONTRIBUTING.md`) inkl. Hinweise zu `ENABLE_EXTENDED_TESTS`.

## Teststrategie & Environments

| Ebene        | Befehl(e)                                               | Inhalt                                               |
| ------------ | ------------------------------------------------------- | ---------------------------------------------------- |
| Core (PR)    | `pnpm test:ts:ci`, `pnpm test:py`                       | Schnelle Unit- und Pipeline-Checks ohne Slow/Exp.    |
| Extended     | `pnpm test:ts:extended`, `pnpm test:py:extended`        | Vollständige Offline-Pipelines (OISST, ERA5) + Smoke |
| Experimental | `ENABLE_EXPERIMENTAL_TESTS=1 pnpm test:ts:experimental` | Prototypen & Redteam-Suites                          |

- `pytest`-Marker: `slow` (Extended), `experimental` (on-demand). Neue Tests bitte entsprechend markieren.
- `ENABLE_EXTENDED_TESTS`, `ENABLE_EXPERIMENTAL_TESTS` steuern die Vitest-Filter.
- `pytest.ini` setzt `pythonpath = src`, damit keine lokalen Hacks nötig sind.

## Sprintgerüst (2-Wochen-Rhythmus)

1. **Sprint 1 – Kern stabilisieren**
   - Alle Core-Tests grün (inkl. `pnpm test:py`).
   - Offene Quick Wins aus Issue-Board schließen (z.B. Pfad-Fixes, Typos).
   - Known-Issues-Liste pflegen (`advancedprogress.json`, `codexfeedback.*`).
2. **Sprint 2 – Modularisierung anstoßen**
   - Feature-Flags konsequent einsetzen (`src/config/featureFlags.ts`).
   - Module in `src/experimental/**` verschieben, sofern nicht kernkritisch.
   - Extended-CI beobachten, Flakes isolieren (Skip/Mark `experimental`).
3. **Sprint 3 – Dokumentation & Governance**
   - README/ONBOARDING & CONTRIBUTING reviewen.
   - Governance-Checks (policy workflows) vereinheitlichen.
   - Release-Notizen für v1.0 vorbereiten.

Sprints wiederholen, bis alle Kern-Metriken grün sind; danach Roadmap 1.x / 2.0 aufspannen.

## Risiko- & Rollback-Strategie

- **Feature-Flags** als Standard: neue Features = `off` bis getestet.
- **Kleine PRs** (max. 300 Zeilen diff) + sofortige CI-Auswertung.
- **Rollback**: Tags pro stabiler Etappe (`v0.9.x-prep`, `v1.0.0-rc1`).
- **Monitoring**: Extended-CI bei Fehler → Issue mit Kontext (Logs, reproduzierbare Schritte).

## Dokumentation & Onboarding

- README + CONTRIBUTING jetzt synchronisiert; ergänzend ONBOARDING.md mit Troubleshooting prüfen.
- Neue Contributor bitte über `docs/CommunityOnboarding.md` führen.
- `codexfeedback.*` als Lauf-Tagebuch nutzen (aktueller Stand Fraktal37 eingetragen).

## Kultur & Governance

- Transparente Kommunikation via Issues/Discussions.
- Labels `run-extended` / `run-experimental` bewusst setzen; ohne Label bleibt Kern schnell.
- Policy-Dateien (`policies/**`, `governance/**`) regelmäßig auditieren, damit CI-Policies nicht veralten.

## Roadmap-Ausblick

- **v1.0**: sobald alle Punkte aus "Minimal Viable Core" stabil + Dokumentation fertig.
- **v1.1-v1.3**: Reaktivierung selektierter experimenteller Module (je Sprint eins).
- **v2.0**: Größere Framework-Upgrades (React 19, Telemetrie, Performance). Erst nach erneuter Stabilitätsphase.

## Tracking Hooks

- `codexfeedback.(md|json|yaml)` aktualisiert (Fraktal37, keine Wiederholung notwendig).
- `advancedprogress.json` weiterhin als Transparenz-Log (keine Schemaänderung in diesem Lauf).
- Für offene Aufgaben `advancedToDo/` & `docs/roadmap/cluster-guidelines.md` nutzen.

> "Erst atmen, dann wachsen." – Fraktal37 markiert den Punkt, an dem UnifiedMandala wieder einen verlässlichen Puls hat.
