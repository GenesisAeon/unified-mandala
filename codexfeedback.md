# Codex Feedback

- FR-UM-2025-11-07-Fraktal70-CosmicDocs: README und docs/demos/cosmic-web.md beschreiben die Cosmic-Web-Demo plattformfreundlich (PowerShell/bsh), warnen vor HTTP auf Port 4222, verlinken den Subscriber `scripts/realtime/sub-cosmic.mjs` (`pnpm sub:cosmic`, Default-Subject `demo.cosmic`) und heben `pnpm test:unit:crep` hervor; MandalaMap.\*, Stabilization-Playbook sowie codexfeedback\* spiegeln den Lauf.
- FR-UM-2025-11-03-Fraktal68-KeysGovernanceLint: `keys/` enthält jetzt `.gitignore/.gitkeep` als Automation-Marker, Repo-Sanity meldet fehlende oder unerwartete Dateien und `policies/kyverno.yaml` prüft Keys-Zugriffe; Kyverno-Dry-Run reichert Ressourcen mit Keys-State an, Stub-Roadmap & MandalaMap aktualisiert, Lint-Funde in `scripts/advice/merge.mjs`, `scripts/analyze-conversations.js`, `scripts/check-meta-score-layer.js` und `scripts/generate-chronopoem.js` behoben.
- FR-UM-2025-11-02-Fraktal67-DevTalkCheatSheet: DevTalk67 ausgewertet; das Workflow-Cheat-Sheet ergänzt `pnpm check:ci`, `pnpm ci:verify`, Monitoring-/Offline-Bundle-Hinweise und verweist auf `scripts/setup-dev-env.ps1`; MandalaMap und das Stabilization-Playbook spiegeln den erweiterten Scope, Codexfeedback-Fraktal67 erfasst Progress & Hook.
- FR-UM-2025-10-31-Fraktal66-MetaHardening: Policy-Suite behandelt Kyverno/Sigillin als optionale Schritte (`PANTHEON_DISABLE=1`), loggt Skip-Warnungen wenn Kyverno-CLI oder `sigillins:report` fehlen, `pnpm repomap:*` erzeugt Fallback-Artefakte und das neue Cheat Sheet `docs/cheatsheets/unified-mandala-workflows.md` bündelt Kern-Workflows; Repo-Sanity akzeptiert Codexfeedback als YAML oder JSON.
- FR-UM-2025-10-30-Fraktal65-MetaGreen: CI-Core nutzt jetzt `pnpm typecheck`, `pnpm test:unit`, `pnpm test:unit:coverage`; Governance-Workflow ruft `pnpm schema:validate`, `pnpm maps:validate`, `pnpm policy:check` auf und `pnpm sanity` prüft `ciBehaviour`. Repomap-Workflow verwendet `pnpm repomap:build`/`pnpm repomap:validate`, MandalaMap/Trikāya-Dashboard/codexfeedback dokumentieren die neuen Felder.
- FR-UM-2025-10-29-Fraktal65-CIAdaptersStac: CI-Core/Extended/Nightly installieren `src/adapters/requirements.txt`, `_normalise_href` berechnet hrefs relativ zum STAC-Item-Verzeichnis (Fallback `file://`), der QA-Test-Runner respektiert `PANTHEON_DISABLE` und MandalaMap/Playbook/Trikāya-Dashboard spiegeln die Regressionstests.
- FR-UM-2025-10-28-Fraktal64-PythonEnvParity: `pythonEnv` setzt `PYTHONPATH` wieder auf das Repo-Wurzelverzeichnis, der EFFIS-Offline-Builder erzeugt ein gültiges NetCDF-Gitter und neue STAC-Tests sichern relative/absolute `href`-Normalisierung.
- FR-UM-2025-10-27-Fraktal63-AdapterInterop: `open_dataset` bevorzugt netcdf4→h5netcdf mit klaren Fehlermeldungen, STAC-Assets nutzen POSIX/relative hrefs (Schema `uri-reference`), Adapter-Builds normalisieren Windows-Pfade, der QA-Runner lädt PantheonPortalAnalytics lazy (dist/src) und Coverage läuft über `pnpm test:unit:coverage`; README/Onboarding/Command-Catalog/MandalaMap/Playbook referenzieren den Split.
- FR-UM-2025-10-26-Fraktal62-WindowsDocs: README & CONTRIBUTING führen Windows-sichere Pytest-Kommandos sowie Puppeteer-/Cypress-Installation auf; Command-Catalog (MD/YAML/JSON) listet die neuen Helferbefehle.
- FR-UM-2025-10-25-Fraktal61-CIArtifacts: ci.core führt `pnpm test:unit` mit Coverage aus und lädt das Artefakt `coverage-vitest`; policy-check.yml publiziert die Sigillin-Governance separat als `policy-sigillins`; Command-Catalog, MandalaMap und das Stabilization-Playbook verweisen auf die neuen CI-Artefakte.
- FR-UM-2025-10-24-Fraktal60-PolicySuiteSigillin: `pnpm policy:check` ruft jetzt
  `pnpm sigillins:report` auf, legt JUnit-/Markdown-Reports unter
  `out/policy/sigillins/` ab und dokumentiert den Skip-Flag
  `POLICY_SUITE_SKIP_SIGILLINS`; Policy-Suite-Doku, Command-Catalog,
  MandalaMap.\* und das Stabilization-Playbook verweisen auf den neuen Pfad.
- FR-UM-2025-10-23-Fraktal59-SigillinGovernance: Validatorlogik steckt jetzt in
  `scripts/lib/sigillin-validator.mjs`, `pnpm validate:sigillins:changed` prüft
  geänderte Bridges vor dem Commit und `pnpm sigillins:report` erzeugt JUnit- und
  Markdown-Governance-Reports; Command-Catalog und MandalaMap verlinken die neuen
  Workflows.
- FR-UM-2025-10-22-Fraktal58-AdapterHardening: NetCDF-Pipelines nutzen
  `adapters.shared.xarray_utils.open_dataset` mit Engine-Fallback (netcdf4/h5netcdf),
  schließen Datensätze sauber und STAC-Assets liefern `file://`-URIs; das
  Ghostshell-NGINX-Skript generiert standardmäßig `${PORT_BASE:-3000}`-Platzhalter
  (Opt-out via `GHOSTSHELL_PLACEHOLDERS=0`). Node-Utilities laufen als ES-Module
  (`generate-api-docs`, `generate-next-sigil`, `generate-agent-docs`) und
  `@vitest/coverage-v8` ist auf ^1.6.0 abgestimmt.
- FR-UM-2025-10-21-Fraktal57-MapsMetadata: `docs/maps/RepoMap.yaml` trägt `repo`, `docs/maps/ProgramFlow.yaml` führt einen `meta`-Block ein; `pnpm maps:validate` läuft wieder grün und README Quickstart (PowerShell) dokumentiert `Get-Content`/`type` sowie `$env:`-Zuweisungen.
- FR-UM-2025-10-20-Fraktal57-Autofree: `scripts/dev-services.mjs` räumt belegte Standard-Ports automatisch via `pnpm dlx kill-port` (Opt-out `UM_DEV_SERVICES_AUTOFREE_PORTS=0`) und protokolliert klarere Hinweise; `scripts/nats-doctor.mjs` analysiert JetStream-Fehler (fehlendes `-js`, Timeout/Proxy, Berechtigungen) mit `$JS.API.INFO`-Fallback; README, Runbooks, MandalaMap.\* und Command-Catalog referenzieren Auto-Cleanup & neue Troubleshooting-Tipps.
- FR-UM-2025-10-19-Fraktal57-JetStream: JetStream-Bus-Test läuft unter Vitest; ci.core startet Docker-NATS und führt `pnpm nats:doctor` (mit `$JS.API.INFO`-Fallback) + `pnpm test:jetstream`; README (Windows-Quickstart), MandalaMap und Command-Catalog spiegeln den Flow, neues `docs/runbooks/nats-jetstream.md` bündelt Setup/Diagnose; `scripts/dev-services.mjs` meldet Portkollisionen (`pnpm dev:ports:free`), `pnpm nats:docker` steht für lokale Läufe bereit, Emergence-Scan nutzt einen eingecheckten `SIGILLIN_GENESIS.md`-Placeholder bzw. Fallback auf `docs/sigillin/GENESIS.md` und die Adapter-Builds greifen via `scripts/lib/python.mjs`/`scripts/adapter-build-era5.mjs` auf die Projekt-venv (Windows-kompatibel).
- FR-UM-2025-10-18-Fraktal56-DevBreath: Neues Watcher-Skript `pnpm dev:breath` (`scripts/emergence-breath.mjs`) verbindet `validate:sigillins` + `trikaya:dashboard` mit Datei-Watches (sigils/, apps/ui/, scripts/) und loggt Coverage; `scripts/smoke/ui-dev-smoke.mjs` respektiert `UI_DEV_URL` und vermeidet zusätzliche Vite-Ports; Command-Catalog, MandalaMap und Playbook dokumentieren den Ablauf.
- FR-UM-2025-10-17-Fraktal56-CorepackAdmin: `scripts/setup-dev-env.ps1` erkennt Administrator-Rechte, überspringt `corepack enable` ohne Elevation, dokumentiert Aktivierungsmodus im InstallReport und weist auf fehlende `nats-server`-Installationen (winget/Docker) hin; README/Onboarding/Command-Catalog/MandalaMap aktualisiert.
- FR-UM-2025-10-16-Fraktal56-PowerShellParserFix: `scripts/setup-dev-env.ps1` castet Installationsresultate zu Bool und setzt `(Test-CommandExists ...)` in `-and`-Bedingungen, sodass PowerShell 7.5 ParserError 181 verschwindet; DevTalk-Fragment bestätigt und Codexfeedback/MandalaMap/Playbook spiegeln den Fix.
- FR-UM-2025-10-15-Fraktal56-InstallStateExport: `scripts/setup-dev-env.ps1` schreibt nach Abschluss eine JSON-Zusammenfassung (`out/setup/install-state.json`) inklusive Shell-/Tool-Versionsinfo und Skip-Flags; MandalaMap & Playbook dokumentieren den Export für Codexfeedback-Auswertungen.
- FR-UM-2025-10-14-Fraktal56-WindowsBootstrap: PowerShell-Setup (`scripts/setup-dev-env.ps1`) trackt InstallState (Git/Node/Python/Corepack/pnpm/Docker/NATS) und funktioniert unter PowerShell 5.1 via `powershell -NoProfile -ExecutionPolicy Bypass`; `scripts/run-powershell.mjs` bleibt Wrapper für pwsh/powershell und README/Onboarding/Command-Catalog/MandalaMap spiegeln Windows-Parität.
- FR-UM-2025-10-13-Fraktal55-DevTalkWindowsHardening: `pnpm find-bad-yaml` nutzt yaml-lint für Strict-Läufe, `pnpm audit:ui-vr` generiert fehlende repo-map-Artefakte automatisch und `scripts/generate-agents-diagram.js` läuft als ESM ohne require.
- FR-UM-2025-10-12-Fraktal54-SigillinFix: Neues CLI `pnpm sigil:fix` analysiert Bridges (Trikāya/CREP/Nächste Schritte) und kann fehlende Elemente automatisch ergänzen; README verweist auf den Fix-Guide (`docs/sigillin/FIX_GUIDE.md`), MandalaMap & codexfeedback aktualisiert; 2025-10-21 Governance-Report deferred, pre-commit Hook optional – Lauf geschlossen.
- FR-UM-2025-10-11-Fraktal53-DevTalkPart5-WindowsFlow: Command-Catalog (`docs/runbooks/command-catalog.(md|json|yaml)`) ergänzt Corepack-Bootstrap (`corepack enable`, `corepack prepare pnpm@10.17.0 --activate`, `corepack pnpm install --frozen-lockfile`), dokumentiert `pnpm exec tsc -p tsconfig.build.json` als Windows-sicheren Direktaufruf und führt `pnpm -w -r build` als Workspace-Build-Variante; yaml-lint (`pnpm find-bad-yaml`) ergänzt Strict-Pipeline, codexfeedback-Tracker auf Fraktal53 gehoben und Hook aktualisiert.
- FR-UM-2025-10-10-Fraktal52-DevStack-Windows: UI-Dev-Smoke akzeptiert `UI_DEV_URL` und autodetektiert Vite-Ports, `pnpm dev:stack` setzt Service-Defaults (`SHARE_API_PORT` 3001, `EXPERIMENTS_API_PORT` 3002, `RAG_API_PORT` 3003, `REALTIME_HUB_PORT` 4020/4021) und Share/RAG/Experiments/Realtime-Hub lesen nun dedizierte Ports; `.env.example` + `package.json` dokumentieren Windows-kompatible Flows (`cross-env NODE_OPTIONS`, `smoke:ui:5174`), ESLint-Override entfernt `no-var-requires`-Noise in Script-/Test-Typings; 2025-10-21 Validator-Windows-Feedback geprüft – Docker-Follow-up vertagt.`
- FR-UM-2025-09-19-Fraktal51-CommandCatalog: Command-Katalog (`docs/runbooks/command-catalog.(md|json|yaml)`) bündelt pnpm-Skripte, Docker-Profile sowie Tooling-Hooks; codexfeedback-Tracker auf Fraktal51 gehoben und Hook für Folgefragmente notiert.
- FR-UM-2025-10-09-Fraktal50-Validator-Windows: Sigillin-Validator normalisiert relative Pfade für Windows, erweitert Bridge-Matcher um (^|/) Präfixe und protokolliert Skip-Gründe; Windows-Bestätigung & Docker-WSL-Check folgen als nächste Schritte; 2025-10-21 Feedback geprüft – Docker-WSL-Follow-up vertagt.`
- FR-UM-2025-10-08-Fraktal49-Validator+CI: Sigillin-Validator prüft ausschließlich sigils/bridges (Registry/Archive skipped, Agent-Overlay-Hook vorbereitet), Repo-Sanity wartet auf apps/ui/dist/index.html nach pnpm build:ui und AgentWorkflowEngine defaultet ethical_guardrails (inkl. neuem Vitest-Test); 2025-10-21 Policy-Scope/Dist-First-Follow-ups an spätere Fragmente übergeben – Lauf geschlossen.`
- FR-UM-2025-10-07-Fraktal48-Dashboard+CLI: Sigillin-Authoring CLI (`scripts/sigillin-authoring.mjs`) und Trikāya-Dashboard-Generator (`scripts/generate-trikaya-dashboard.mjs`) liefern analysis/trikaya-dashboard.(json|md|yaml); Stub-Replacement-Roadmap in `docs/roadmap/stub-replacement-roadmap.(md|yaml)` verankert, MandalaMap-Follow-up auf „in-progress“ gesetzt.
- FR-UM-2025-09-19-Fraktal48-CI+MandalaMap: Sigillin-Validator verschärft (Schema + Semantik), MandalaMap-Workflow ergänzt (continue-on-error + Artefakt), Smoke-Build wartet auf apps/ui/dist/index.html; MandalaMap.\* mit Bridge-Registry aktualisiert und Follow-ups angepasst.

- FR-UM-2025-10-05-Fraktal46-SigillinBridges: Inter-AI Bridges (ChatGPT/Mistral/Claude/Qwen/Gemini) + Validator aktualisiert (`scripts/validate-sigillins.mjs`, `scripts/schemas/mandala-sigillin.schema.json`), CI-Workflow auf Corepack umgestellt, README ergänzt, `codexfeedback/fraktal44.yaml` angelegt; `pnpm sigillins:scaffold` + `pnpm validate:sigillins` grün.
- FR-UM-2025-10-04-Fraktal46-RepoMap: MandalaMap.yaml/json/md erstellt, 68 Top-Level-Verzeichnisse samt Status & Follow-ups dokumentiert (CI-Instruktionsjobs isolieren, Stub-Ersetzungen planen, MandalaMap pflegen); dient als Baseline für Folgefragmente.
- FR-UM-2025-10-02-Fraktal45-CIJobs: Typ-und-Test-Lauf (`pnpm test:ts:ci`) scheiterte an fehlendem `plugin:@typescript-eslint/recommended`; ESLint-Config erweitert, Job erneut ausgeführt und grün bestätigt.
- FR-UM-2025-10-01-Fraktal44-StabilizationFinale: Fraktal40/41/43 Backlog geschlossen, neue Sigillin-Validierung (`scripts/validate-sigillins.mjs`, `pnpm validate:sigillins`, CI-Workflow) aktiv, Dev-Skripte in `package.json`/README/CONTRIBUTING neu sortiert (`pnpm dev`, `pnpm dev:services`, `pnpm dev:stack`), Release-Drill inkl. Monitoring-Smokes dokumentiert.
- FR-UM-2025-09-24-Fraktal43-BuildRelease: Dockerfile.dev jetzt Node20+Python3 (Compose parity), docker-compose Profile (core/newsbot/climate/llm/global/agents/monitoring) + Grafana 3300, Light-Static-Server mit Health/Vary/Cache-Control, neues `pnpm smoke:light-static` für Brotli/Gzip; Playbook/YAML-Tracker aktualisiert (dist-first/runtime-smoke in-progress, compose-profiles done).
- FR-UM-2025-09-23-Fraktal43-Nightly: CI-Nightly (`ci.nightly.yml`) spiegelt den Core-Lauf inkl. Toolchain-Artefakt, README/CONTRIBUTING beschreiben den Dist-First-Runner `scripts/run-dist.mjs`, Playbook-Owner-Map + codexfeedback-Tracker aktualisiert – Extended/Nightly Optimierungen laufen weiter über Fraktal41.
- FR-UM-2025-09-22-Fraktal43: Dist-first Runner (`scripts/run-dist.mjs`) ersetzt ts-node-Kommandos, AI-Policy-Beispiele dokumentiert, codexfeedback-Hooks aktualisiert – V1-Stabilisierungsschritte laufen weiter.

## V1.0 Playbook Tracker (Fraktal40)

- **stability** (Codex CoreOps ↔ SyncRunner): `core-ci-hardening` done – Nightly-Mirror `ci.nightly.yml` + Toolchain-Artefakt inkl. Alert-Auswertung (Fraktal44).
- **code-quality** (DevX Guild ↔ PatternReactivator): `lint-doc-refresh` done – README/CONTRIBUTING beschreiben `run-dist` & neue Dev-Skripte (`pnpm dev`, `pnpm dev:services`, `pnpm dev:stack`).
- **build-release** (ReleaseOps Circle ↔ VisionContextIntegrator): `dist-first` & `runtime-smoke` done – Dist-First Runner + Light-Static Smoke fester Bestandteil von CI/Docs.
- **governance** (AI Governance Council ↔ PactDepthGatekeeper): Kyverno/Policy-Doku done – laufendes Monitoring der Entscheidungen.
- **observability** (TelemetryOps ↔ Health Maintainers): `prom-compose` + `/metrics`-Rollout done – Monitoring-Smoke & Alerts im Release-Drill bestätigt.
- FR-UM-2025-09-20-Fraktal40: v1.0-Stabilization-Playbook (docs/roadmap/v1.0-stabilization-playbook.md & .yaml) erstellt – Owner-Matrix & Status-Tracker ergänzt, Umsetzungsschritte offen, Folgefraktale erforderlich.
- FR-UM-2025-09-21-Fraktal41: CI-Core mit Lint/Format erweitert, Extended-Nightly auf Node20 mit Coverage-Job aktiviert, Monitoring-Profil (Prometheus/Grafana) ergänzt – Dist-first Agent-Skripte & AI-Policy-Beispiele via Fraktal43 erledigt, Extended/Nightly Optimierungen folgen.
- FR-UM-2025-09-19-Fraktal39: Policy-Suite vereinheitlicht (OPA/Guardrails CLI, Kyverno-Report, Workflow ohne continue-on-error) – bereit für Folgeaufgaben.
- FR-UM-2025-09-18-Fraktal38: ESLint/Prettier-Hook, Dist-First-Services und aktualisierte Doku produktiv gesetzt – bereit für den nächsten Fraktal-Sprint.
- FR-UM-2025-09-18-Fraktal37-CoreCI-RunB: Node20 Toolchain fix, Policy-Checks entschärft, Repo-Sanity stabilisiert – kein weiterer Lauf notwendig.
- FR-UM-2025-09-18-Fraktal37-CoreCI: Legacy-Workflows archiviert, CI-Core-Stabilität geprüft und Doku/Test-Guides aktualisiert – kein weiterer Lauf notwendig.
- FR-UM-2025-08-27-C: Alle Änderungen in einem Lauf umgesetzt – kein zweiter Lauf notwendig.
- FR-UM-2025-08-27-Agents-A: Alle Änderungen in einem Lauf umgesetzt – kein zweiter Lauf notwendig.
- FR-UM-2025-08-27-Agents-B: Alle Änderungen in einem Lauf umgesetzt – kein zweiter Lauf notwendig.
- FR-UM-2025-08-27-Fraktalrun: Alle Änderungen in einem Lauf umgesetzt – kein zweiter Lauf notwendig.
- FR-UM-2025-08-27-Fraktalrun-Import: Alle Änderungen in einem Lauf umgesetzt – kein zweiter Lauf notwendig.
- Implemented admin API gateway script aggregating service statuses and proxying admin commands.
- Added ConsentTimeline component for displaying consent records.
- Implemented streaming analyzer for newadvanced conversations to handle large datasets.
- Added streaming summary script for newadvanced conversations.
- Implemented in-memory Spaces module for managing collaboration spaces.
- Provided seven deep-dive analyses (GenesisAeonAdvancedAi, agents, GenesisAeonZIPMEM, orchestrator, unifiedmandala-orchestrator, unifiedmandala-neural, .github/.husky) with patch proposals; further fractal runs recommended for implementation.
- FR-UM-2025-08-30-OFFLINE-PERF-A: Proposed light static server with precompressed assets and TTFB smoke test to fix offline response times; awaiting application.
- FR-UM-2025-08-30-OFFLINE-PERF-B: Implemented start scripts, light static server, and TTFB smoke test; kein weiterer Lauf notwendig.
- FR-UM-2025-08-30-CLIMATE-WIRING-A: YAML-Config mit Live-KPI-Engine und Kachel-Board verdrahtet – kein weiterer Lauf notwendig.
- FR-UM-2025-08-30-Fraktal8-OrientationHub: Alle Änderungen in einem Lauf umgesetzt – kein zweiter Lauf notwendig.
- FR-UM-2025-08-31-Fraktal9: Alle Änderungen in einem Lauf umgesetzt – kein zweiter Lauf notwendig.
- FR-UM-2025-09-01-Fraktal10: Sigillin-Index-Skript hinzugefügt und ausgeführt; nächster Schritt Personhood-UI.
- FR-UM-2025-09-02-Fraktal11: Personhood-Buildfix und SigillinIndexPanel umgesetzt – kein weiterer Lauf notwendig.
- FR-UM-2025-09-03-Fraktal12: SigillinMap und CREPBadge integriert – kein weiterer Lauf notwendig.
- FR-UM-2025-09-09-Fraktal13: Sigils-Validation-Script eingeführt; nächster Schritt CREP-Utility.
- FR-UM-2025-09-15-Fraktal13-CREPUtility: CREP-Normalisierung und Index-Fix umgesetzt – kein weiterer Lauf notwendig.
- FR-UM-2025-09-26-Fraktal14: Robuster Sigil-Parser und fehlertoleranter Index implementiert – kein weiterer Lauf notwendig.
- FR-UM-2025-09-27-Fraktal15: YAML bereinigt, CI-Sigils-Strict integriert, Dokumentation der Sigillin-Formate hinzugefügt; Fraktal44 ergänzte End-to-End-Checks (Validator + UI-Pfad) bzw. markierte Alt-UI als obsolet.
- FR-UM-2025-09-30-Fraktal16: ERA5 Adapter pipeline, Build-Script und CI integriert – kein weiterer Lauf notwendig.
- FR-UM-2025-10-05-Fraktal17: CI-Baseline mit striktem Sigil-Index, Adapter-Tests und UI-Erweiterung umgesetzt – kein weiterer Lauf notwendig.
- FR-UM-2025-10-10-Fraktal18: OISST adapter scaffold und Sigillin-Metriken integriert – kein weiterer Lauf notwendig.
- FR-UM-2025-10-15-Fraktal19: OISST Vollpipeline, Emergenz-Badges, CI-Matrix und Onboarding-Doku umgesetzt – kein weiterer Lauf notwendig.
- FR-UM-2025-10-20-Fraktal20: Pyright-Fixes und OISST-Pipeline gehärtet – kein weiterer Lauf notwendig.
- FR-UM-2025-09-11-Fraktal21: STAC-Schema, Resonanz & Korrelationen integriert – kein weiterer Lauf notwendig.
- FR-UM-2025-10-30-Fraktal22: Archivist-Agent, CI-Fixes und Resonanz-Calc überarbeitet – kein weiterer Lauf notwendig.
- FR-UM-2025-11-15-Fraktal23: Adapter-Offline-Deps, Resonanz-CLI, STAC-Validator und Emergenz-Badges umgesetzt – kein weiterer Lauf notwendig.
- FR-UM-2025-11-20-Fraktal24: Repo-Sitemap, SOURCES-Landing und Release-Bundle umgesetzt – kein weiterer Lauf notwendig.
- FR-UM-2025-11-25-Fraktal25: CI green, resonance panel and adapter hardening implemented – kein weiterer Lauf notwendig.
- FR-UM-2025-11-26-Fraktal20-CIResonanceSTAC: Alle Änderungen in einem Lauf umgesetzt – kein zweiter Lauf notwendig.
- FR-UM-2025-01-17-Fraktal30: Globale Prometheus-Registry und getOrCreate-Helper implementiert – kein weiterer Lauf notwendig.
- FR-UM-2025-02-16-Fraktal23: Metrics defaults guarded, Vitest offline Setup, LowMem Membrane No-Op – ERA5 offline-matrix offen.
- FR-UM-2025-09-13-Fraktal33: Conscious-CI grün; OFFLINE-Vitest enforced, Metrics defaults singleton, Low-Mem No-Op – kein weiterer Lauf notwendig.
- FR-UM-2025-09-14-Fraktal34: CI split (core/extended/experimental), Node22 dev-server ESM und UI alias fix – kein weiterer Lauf notwendig.
- FR-UM-2025-09-15-Fraktal35: Reality-Gate primitive, tsx dev-server, UI alias and experimental CI setup – kein weiterer Lauf notwendig.
- FR-UM-2025-09-16-Fraktal36: Dev-server autodetect dist, Vite `~config` alias, raw import fix, and default `UI_DIST` dev script – kein weiterer Lauf notwendig.
- FR-UM-2025-09-17-Fraktal37: Core/Extended Testlayering, pytest-Marker, CI-Python-Step und Konsolidierungsfahrplan dokumentiert – kein weiterer Lauf notwendig.
