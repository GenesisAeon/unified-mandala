# MANDALA_MAP.md

# Generated: 2026-07-26

# unified-mandala — Inhaltskartierung (Archäologie-Sprint, erster Durchgang)

> **Nicht zu verwechseln mit `MandalaMap.{md,json,yaml}`** im selben Repo-Root:
> jenes ist ein älteres, separates, auto-generiertes Modul-/CI-Inventar (79
> Einträge, Version 1.0, generiert 2025-12-01, Kategorien wie
> automation/governance/ci-infra/core-runtime/agents/observability/support/
> data-intel/research/testing/backlog — es beschreibt, welche
> Werkzeuge/CI-Bausteine es gibt). Dieses Dokument hier ist eine andere,
> komplementäre Kartierung: **Inhalts-Archäologie** — für jeden gefundenen
> Cluster eine Migrations-/Erhaltungs-Entscheidung (migriert / Paket-Kandidat /
> Blueprint / Log / veraltet / unklar).

**Wichtiger Hinweis zum Umfang:** `unified-mandala` hat mehrere tausend
Dateien über Dutzende Top-Level-Verzeichnisse. Eine erschöpfende
datei-für-datei-Klassifikation war in einem Durchgang nicht seriös möglich.
Diese Karte klassifiziert auf **Verzeichnis-/Cluster-Ebene** mit
Stichproben-Verifikation (Zeilenzahl, Klassen/Funktionen, echte vs.
Platzhalter-Logik) und markiert explizit, was noch tiefere Prüfung braucht.
Konservativ klassifiziert: nichts als Paket-Kandidat markiert ohne echten,
lauffähigen Code mit echter Logik.

---

## Legende

| Symbol            | Bedeutung                                                                |
| ----------------- | ------------------------------------------------------------------------ |
| 🟢 MIGRIERT       | Code existiert (mutmaßlich) bereits als eigenständiges GenesisAeon-Paket |
| 🔵 PAKET_KANDIDAT | Hat echten Code, könnte eigenes Paket werden                             |
| 📋 BLUEPRINT      | Konzept dokumentiert, noch kein/kaum lauffähiger Code                    |
| 📜 LOG            | Gesprächshistorie / Kollaborationsprotokoll                              |
| 🔴 VERALTET       | Superseded durch neuere Implementierung                                  |
| ❓ UNKLAR         | Braucht manuelle/tiefere Entscheidung                                    |

---

## Strukturüberblick

Top-Level-Verzeichnisse (Auswahl, ohne `.git`/`node_modules`/`dist`/`out`/
`.venv`/`build`): `.github`, `.husky`, `.registry`, `GenesisAeonAdvancedAi`,
`GenesisAeonZIPMEM`, `advancedToDo_parts`, `agents`, `analysis`, `apps`,
`aws`, `charts`, `ci`, `codex`, `codex-sync`, `codexbuild`, `codexfeedback`,
`config`, `cypress`, `data`, `demos`, `deployment`, `docs`, `examples`,
`experiments`, `fixtures`, `fraktalrun`, `go-agent`, `go-bridge`,
`governance`, `grafana`, `infrastructure`, `ingest`, `integration`, `k8s`,
`keys`, `manifest`, `observability`, `orchestrator`, `packages` (~140
pnpm-Workspace-Pakete), `pipelines`, `plugins`, `policies`, `processes`,
`prompts`, `public`, `runners`, `schemas`, `scripts`, `services`, `sigils`,
`sims`, `simulations`, `src`, `stubs`, `tests`, `tools`, `types`,
`unifiedmandala-neural`, `unifiedmandala-orchestrator`, `validation`,
`worldview`.

Datei-Typen (Top): 1834 `.ts`, 548 `.yaml`, 410 `.tsx`, 397 `.py`, 356 `.md`,
330 `.patch`, 292 `.html`, 216 `.json`, 122 `.js`, 122 `.go`, 108 `.mjs`.

**`src/`, `apps/`, `packages/` (~140 Workspace-Pakete), `scripts/`** sind der
**aktive, laufende Code dieses Repos selbst** — nicht Archäologie-Material,
sondern unified-mandalas eigene, fortlaufende Rolle als Monorepo/
Inter-AI-Bridge (siehe Zenodo-Eintrag). Bleibt unangetastet, nicht Teil der
Migrations-/Extraktionsbetrachtung.

**Was diese Inter-AI-Bridge-Rolle konkret ausmacht** (4. Durchgang,
2026-07-26, geklärt durch `sigils/`): reale, strukturierte YAML/JSON-
"Sigillin"-Briefing-Configs pro LLM-Anbieter (`sigils/bridges/{chatgpt,
claude,gemini,mistral,qwen}/`) mit System-Prompt, CREP-Scoring,
Few-Shot-Beispielen und Evaluationskriterien — das ist die tatsächliche
Umsetzung dessen, was das Repo von sich selbst behauptet zu sein. Aktive
Konfigurationsdaten, kein eigener Archäologie-Fund, aber wichtig zum
Verständnis. `schemas/`/`types/` sind unterstützende JSON-Schemas
(Sigil-Message-, Event-Bus-, MandalaMap-Validierung) bzw. TS-Ambient-
Type-Deklarationen für Drittbibliotheken — ebenfalls unterstützende
Infrastruktur, keine eigenen Cluster. `codex/`, `codex-sync/`,
`codexbuild/`, `codexfeedback/`, `advancedToDo_parts/` sind Build-/
Feedback-Log-Daten eines Codex-Automatisierungssystems (pro-"Fraktalrun"-
Feedback-YAMLs) — Tooling-Logs, keine Domänenlogik, ein Blick in
`codex-sync/answer-suggestions.js` (18 Zeilen, liest `codex/
suggestions.yaml` und druckt sie) bestätigt das.

---

## 🟢 Bereits migrierte Module (Verdachtsfälle, nicht abschließend geprüft)

| Datei/Ordner                                                                                                                                                                              | Migriert nach (Verdacht)                                           | Notiz                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `worldview/mandala-worldview.yaml`                                                                                                                                                        | `worldview` (eigenes Repo)                                         | Nur eine einzelne YAML-Konfigdatei übrig, kein Code mehr hier — spricht für vollständige Migration, aber nicht per Diff verifiziert.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `GenesisAeonAdvancedAi/`                                                                                                                                                                  | `aeon-trikaya` (P52, neu, lokal unter `D:\mandala\aeon-trikaya`)   | Per Diff verifiziert: kein Duplikat von `aeon-ai`. Alle 17 echten Module + alle 20 Testdateien vollständig portiert (76/76 Tests grün, ruff clean, mypy --strict clean), Diamond Interface (`AeonTrikayaSystem`) ergänzt. 9 Blueprint-Dokumente als `docs/blueprints/` mitgenommen (nicht Teil des Wheels). `git init` + `v0.1.0`-Tag (Bugfix-Release `v0.1.1` am 2026-07-26: optionales `[plotting]`-Extra war nicht wirklich optional, `__init__.py` importierte `plot_crep_mandala`/plotly bedingungslos — gefunden beim Bau von `aeon-sealcore`), noch nicht auf PyPI/GitHub.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `GenesisAeonZIPMEM/{seal_core,self_organizing_memory,master_coordinator,dynamic_task_allocator,advanced_ai_system,aeon_seal_ai,fractal_agent}.py` + `agents/`, `conversation_importer.py` | `aeon-sealcore` (P54, neu, lokal unter `D:\mandala\aeon-sealcore`) | Aus dem Log-Archiv-Verzeichnis herausgelöst (10 Module, ~554 Zeilen — größer als die ursprünglich geschätzten ~390, da `conversation_importer.py`/`agents/` mitgezählt wurden). `SealCore`s Threshold-Adaption (`default`/`growth`/`alert`) ist echt und korrekt, wird aber im aktuellen Zusammenspiel nur durch einen Empty-Memory-Edge-Case im ersten Zyklus erreicht (`growth` einmalig, danach dauerhaft `default`; `alert` faktisch unerreichbar) — Ursache: `agents/crep_bridge.py`s `evaluate_crep()` ist ein Stub mit denselben hartkodierten Werten wie `aeon-trikaya`s eigener `crep_eval.py`-Stub. `FractalAgent`/`MasterCoordinator` sind Orchestrierungs-Grundgerüst ohne echte Agentenlogik. `archiv_aeon.archive_conversation()`s `KMeans(n_clusters=5)`-Crash bei <5 Fragmenten wurde in `v0.1.1` gefixt (`n_clusters = min(5, len(fragments))`, mit Johann abgestimmt). Zwei Original-Tests (`test_conversation_importer.py`) verwiesen auf Johanns echte Gesprächsfragmente — nicht portiert, stattdessen mit synthetischen Fixtures neu geschrieben (Privatsphäre). 26/26 Tests grün, 95% Coverage, ruff clean, mypy --strict clean. `git init` + `v0.1.1`-Tag, noch nicht auf PyPI/GitHub. |
| `agents/personhood/AIJuristicAgent.ts` + `data/personhood/cases/`                                                                                                                         | `aeon-jurist` (P55, neu, lokal unter `D:\mandala\aeon-jurist`)     | TypeScript → Python portiert (kein eigenes Build-Tooling im Original, daher voller Port statt TS-Wrapper). **Korrektur gegenüber dem Extraktions-Prompt**: dieser schlug einen trainierten `MultinomialNB`-Klassifikator vor, der eine Granted-Wahrscheinlichkeit vorhersagt — das ist nicht der reale Algorithmus. Der echte TS-Code trainiert nichts: das Schutzlevel (P0/P1/P2) ist ein fixes Lookup auf das Subjekt der Anfrage, unabhängig vom Ausgang des ähnlichsten Präzedenzfalls (eine `"ai"`-Anfrage bekommt immer P2, obwohl der einzige KI-Präzedenzfall explizit _keine_ Rechtspersönlichkeit gewährt). Treu portiert statt des Prompt-Vorschlags umgesetzt. Auch die vom Prompt-Template angenommenen Präzedenzfälle "Ganges IN, Amazon EC" existieren nicht in den echten Daten — nur 3 reale Fälle vorhanden (Whanganui River NZ 2017, Atrato River Colombia 2016, ein EU-AI-Act-Diskussions-Stub). Diamond Interface (`AeonJurist`) mit einer klar als neu/interpretativ gekennzeichneten CREP/UTAC-Zuordnung. 11/11 Tests grün, 100% Coverage, ruff/mypy clean. `git init` + `v0.1.0`-Tag, noch nicht auf PyPI/GitHub.                                                                      |

Eine belastbare MIGRIERT-Liste braucht einen Datei-Hash-/Namens-Abgleich
gegen alle ~52 Ökosystem-Repos — das ist ein eigener, größerer Task (nicht
in diesem Durchgang gemacht).

---

## 🔵 Paket-Kandidaten

| Cluster                                                                                                                                                                                                   | Zeilen (Kern)                            | Konzept                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Empfehlung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unifiedmandala-neural/` + `unifiedmandala-orchestrator/`                                                                                                                                                 | ~150 Python + `server.ts`                | 4 separate Docker-Microservices (GNN/HGNN, KAN-Physik-Sim, Liquid Neural Net, SNN-Haptik) plus ein Orchestrator (FastAPI `app.py` + `sigillin_scheduler.py` + Node-Server). Echter, lauffähiger Code (z. B. `gnn_hgnn/main.py`: echtes `torch_geometric`-Training), aber Demo-Reife (Loss auf Zufallszielen, keine echte Supervision). **Ausnahme geprüft (2026-07-26): `kan_physics/kan_simulation.py` läuft nicht** — 13-Zeilen-Demo, die `KANLayer` aus einem lokalen Type-Stub importiert (`stubs/kan_network.py`: `class KANLayer: pass`, kein `__init__`/`forward`, lässt sich nicht mit Konstruktor-Argumenten instanziieren — Crash bestätigt). Das Dockerfile installiert zwar zur Laufzeit ein echtes `kan-network`-PyPI-Paket, das wurde hier aber nicht geprüft (kein Netzwerkzugriff). Nichts davon war für das neue `kan-physics`-Paket (P53, siehe unten) verwertbar — dessen echter Kern (r-Kalibrierungsformel) stammt stattdessen aus `resilience-core` (P40), nicht aus diesem Code. **Ergänzung (2. Durchgang, 2026-07-26)**: `experiments/{ab_test,energy_profile,self_tuner,stress_test}` sind reale, aber kleine (19–45 Zeilen) Test-/Tuning-Tools genau für diesen Cluster (FastAPI-Feedback-Sammler, CPU/Mem-Profiler für die SNN/LSTM-Container, ein Q-Learning-artiger Threshold-Self-Tuner der live `../orchestrator/pipeline_config.yaml` überschreibt, ein async Load-Tester gegen den `sigillin-event`-Endpoint). Kein eigener Extraktions-Kandidat, aber `self_tuner/crep_tuner.py` verdient Aufmerksamkeit: es mutiert ungetestet eine Produktionskonfigurationsdatei. | Paket-Kandidat, aber erst nach Ausbau zu echtem Training/Datensatz sinnvoll extrahierbar. Kein bekanntes Ökosystem-Äquivalent gefunden. **`kan_physics`-Teil separat behandelt**: siehe `kan-physics` (P53, lokal initialisiert unter `D:\mandala\kan-physics`, `git init` + `v0.1.0`-Tag, noch nicht auf PyPI/GitHub) — Diamond-Interface-Paket für UTAC-r-Kalibrierung, Mode 1 (analytisch) fertig und verifiziert, Mode 2 (KAN-gelernt) wartet auf echte Zeitreihendaten aus P18 (`amoc-utac`). |
| `packages/{socialgoodmesh,userfriendship}` + `apps/{socialgood-ui,socialgood-mobile}` + `docs/api/friendship-socialgood.yaml` (5. Durchgang, 2026-07-26 — korrigiert gegenüber der vorherigen Einordnung) | ~15 Dateien über 4 Verzeichnisse         | **Korrektur einer eigenen Schlussfolgerung aus dem 4. Durchgang**: dort war Johanns "Freundschaftssystem"-Erinnerung als unbestätigt eingestuft worden, weil nur `packages/userfriendship` selbst keinen Freundschafts-Bezug zeigte. Der 5. Durchgang (docs/-Archäologie) fand die fehlenden Teile: `docs/api/friendship-socialgood.yaml` ist eine echte OpenAPI-Spec, **buchstäblich betitelt "Friendship & SocialGood API"** (Endpunkte `/regions`, `/socialgood`) — Johanns Erinnerung war also richtiger als meine vorherige Einschätzung, ich hatte zu früh korrigiert. Dazu zwei bisher nicht gefundene Apps: `apps/socialgood-ui` (React: `ProjectListView`, `ImpactDashboard`, `CustomRegionGallery`, `TodoButton`, `UsecaseComponents`, alle mit Tests) und `apps/socialgood-mobile` (React Native: `MobileImpactDashboard`, wrapped die Web-Komponente). Zwei Workflow-Trigger-Skripte (`scripts/trigger-socialgood-workflow.js`, `scripts/run-parsing-socialgood.js`) rufen echte lokale Endpunkte auf (`POST /usecases/todo/parse`, `POST /socialgood/match`). Alle Komponenten sind aber weiterhin nur dünne Hüllen (z. B. `CustomRegionGallery.tsx`: rendert nur eine `<div>`-Liste, keine echte Logik) — die Breite (Go-Backend + Web + Mobile + API-Spec + Trigger-Skripte) ist real, die Tiefe pro Schicht bleibt Platzhalter-Niveau. Weiterhin kein Beleg für Johanns zweite Vermutung (Behördengang-Unterstützung).                                                                                                                                                                  | Deutlich mehr Substanz als zunächst angenommen — eigene Extraktion (P56?) wäre technisch möglich, bräuchte aber erst eine echte Fachschicht (Matching-Logik, Persistenz) statt der aktuellen In-Memory-Stubs über alle Schichten hinweg.                                                                                                                                                                                                                                                           |
| `agents/_shared/` (2. Durchgang, 2026-07-26)                                                                                                                                                              | ~160 Zeilen TS (7 Dateien)               | Echtes, kleines Agent-Laufzeit-Framework: typisiertes `Agent<Input,Output>`-Interface (`id`/`health()`/`run()`/optional `getCapabilities()`), Circuit-Breaker, Guardrails (erlaubte Domains, Consent-Flag), Rate-Limit, Retry, Logger, HTTP-Helfer. Kein Stub — jede Datei hat echte, wenn auch simple, Logik. **Aber**: von den 32 `agents/`-Unterordnern nutzt nur `echo/index.ts` (der trivialste, ein reiner Passthrough) dieses Framework tatsächlich; alle anderen sind eigenständige FastAPI-Python-Services oder freistehende TS-Funktionen ohne Bezug dazu.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Gebaute, aber kaum adoptierte Infrastruktur — Entscheidung nötig: ausbauen und die übrigen 29 Agenten darauf umstellen, oder als überholten Erstentwurf archivieren?                                                                                                                                                                                                                                                                                                                               |
| `simulations/universe-sim/` (Go, 2. Durchgang, 2026-07-26)                                                                                                                                                | 916 Zeilen, 19 Dateien                   | Reale, lauffähige Multi-Agent-Gitter-Simulation (Explorer/Observer-Agenten, JSONL-State-Log) plus ein gRPC-Federation-Server (`pkg/federation/server.go`) mit protobuf-Definitionen (`api/sim.pb.go`). Demo-Reife, kein `UTAC`/`CREP`/`Gamma`-Bezug im Code selbst, aber konzeptionell verwandt (Multi-Agent, Föderation).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Vergleichbare Reife wie `unifiedmandala-neural` oben — echter Code, aber noch kein GenesisAeon-Ökosystem-Paket-Äquivalent; keine Python-Paket-Konvention für Go vorhanden.                                                                                                                                                                                                                                                                                                                         |
| `orchestrator/` (4. Durchgang, 2026-07-26 — nicht zu verwechseln mit `unifiedmandala-orchestrator/`)                                                                                                      | ~90 Zeilen, 6 Dateien (2 Module + Tests) | Echter, getesteter Python-Code für die NewsBot-Content-Pipeline: `main.py` (FastAPI, `TrainingStore`/`DraftStore`/`LiveStore` — JSON-Datei-basiert, Endpunkte `/training/collect` und `/publish` für einen Draft-Approval-Workflow) und `newsbot_orchestrator.py` (`run_pipeline()` ruft drei externe Microservices via HTTP: `NEWS_FETCHER_URL`, `SCRIPT_GEN_URL`, `TTS_URL` — keiner davon als eigenständiger Service in diesem Repo gefunden). Thematisch verwandt mit den `agents/newsbot`/`agents/news_climate`-Stubs aus dem 2. Durchgang, aber ein eigenständiges Modul.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Klein, aber echt und getestet — Kandidat für eine eigene Extraktion (P56?), falls die drei externen Microservices existieren/nachgebaut werden sollen; sonst bleibt es unvollständige Infrastruktur.                                                                                                                                                                                                                                                                                               |
| `plugins/` (4. Durchgang, 2026-07-26)                                                                                                                                                                     | 29 Dateien                               | **Wichtige Ergänzung zum 29-Agenten-Blueprint-Fund aus dem 2. Durchgang**: die dortigen Platzhalter-Agenten sind kein loses Gerüst, sondern in ein echtes Plugin-Governance-System eingebunden — `registry.json` (Genehmigungs-/Blacklist-/Versions-Lock-Flags pro Plugin), `manifest.schema.json` + `manifest.yaml` (JSON-Schema-validiertes UI-Plugin-Manifest, verknüpft `apps/sharedream-interface`-React-Komponenten mit CREP-Bedingungen, z. B. `crepCondition: '>=0.7'`), und pro-Agent-YAMLs (z. B. `cosmic_events.yaml`: `entrypoint: agents/cosmic_events/main.py`) als Registrierungsschicht. Drei echte JS-Plugin-Implementierungen gefunden: `mandalaHaiku.js` (funktioniert wirklich — generiert CREP-Alert-getriggerte Haikus über Socket.IO, mit Prometheus-Zähler und Community-Pattern-Override; laut `registry.json` **`approved: true`, versionsgesperrt 1.1.0**), `mistralCodeAgent.js` (ruft einen externen lokalen Mistral-Codeanalyse-Dienst auf `localhost:4111` auf, `approved: true`), `poeticResonance.js` (4-Zeilen-Stub, `approved: false`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `mandalaHaiku` ist der einzige vollständig funktionierende, genehmigte Plugin-Fund dieser Session — klein genug für eine eigene Extraktion, falls gewünscht. Das Registry-Governance-Muster selbst (approved/blacklisted/versionLock) ist real und könnte als Vorbild für ein generelles GenesisAeon-Plugin-Freigabesystem dienen.                                                                                                                                                                 |

### `GenesisAeonAdvancedAi` vs. `aeon-ai` — Diff-Ergebnis (2026-07-26)

Klassen-/Funktionssignaturen beider Seiten verglichen (17 reale Module in
`GenesisAeonAdvancedAi`, ohne `test_*.py`, gegen `aeon-ai/src/aeon_ai/`s
9 Module). **Ergebnis: kein Duplikat, geringe Überschneidung (~3 von 17
Modulen, ~20%).**

- **Echte konzeptionelle Überschneidung** (vermutlich durch `aeon-ai`s
  sauberere, typisierte Neufassung ablösbar): `crep_eval.py`
  (`evaluate_crep`) ↔ `aeon-ai`s `CREPEvaluator`/`CREPScore`
  (harmonic_mean/weighted_mean/shannon_entropy/coherence/resonance/
  emergence — deutlich ausgereifter); `sigil_loader.py`
  (`load_sigil`/`load_start_sigil`, reines YAML-Laden) ↔ `aeon-ai`s
  `SigillinBridge`/`Sigil` (Matching + Activation-Scoring, klar
  mächtiger); `aeon_agent.py`/`advanced_agent.py` ↔ `aeon-ai`s
  `Orchestrator`/`OrchestratorResult` (ähnliche Rolle, andere,
  modernere Architektur).
- **Keine Entsprechung in `aeon-ai`** (~10 von 17 Modulen, genuin
  eigenständig): `trikaya.py` (CREP-Wert → PRÄSENZ/LEERE/AUFLÖSUNG/
  UNBEKANNT-Zustandsklassifikation, dokumentiert in `Trikaya.md`,
  aktiv genutzt von `aeon_cli.py`), `adaptive_threshold.py`
  (`auto_adapt_crep_threshold` — Schwellenwert-Selbstanpassung),
  `aeon_processor.py`s `fraktal_feedback*`-Familie (Graph +
  Metriken) und Haiku-/Poesie-Generierung, `mandala_visualizer.py`
  (`plot_crep_mandala` — tatsächliches Mandala-Plotting),
  `memory_store.py` (persistenter JSON-Store mit Trend-/
  Volatilitäts-Metriken über Zeit), `plugin_loader.py` (Plugin-
  Manifest-System), `archetype_tools.py`, `performance_monitor.py`,
  `aeon_web.py` (Flask-Endpunkte `/act`, `/summary`), `aeon_logger.py`,
  `symbol_tools.py`.
- **`AeonMembraneBlueprint.md`/`masterplan.md`/`Trikaya.md`/`agents.md`**
  beschreiben eine eigene, laufende Initiative ("AeonNeuroNetz" mit
  numerisch-symbolischen "AeonMembraneLayern", Agentenrollen wie
  VisualAgent/SoundAgent/SymbolAgent, Meilensteine "ProtoDeploy Q1
  2026" → "Fraktale Optimierung Q2 2027") — kein verwaistes Konzept,
  sondern ein aktiv verfolgter, eigener Plan. `trikaya.py` ist bereits
  echte, produktiv genutzte Umsetzung von `Trikaya.md`, kein Stub.

**Empfehlung**: nicht als Ganzes VERALTET markieren. Die 3 überlappenden
Module sind Konsolidierungskandidaten (prüfen, ob `GenesisAeonAdvancedAi`
darauf umgestellt werden kann, statt eigener Reimplementierung); die
übrigen ~14 Module (inkl. aller Blueprints) sind eigenständig und real
aktiv — Kandidat für eine eigene Extraktion, nicht für eine Fusion in
`aeon-ai`.

---

## 📋 Blueprints (Konzepte ohne/mit wenig Implementierung)

| Cluster                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Priorität  | Nächster Schritt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~`GenesisAeonAdvancedAi/AeonMembraneBlueprint.md`, `AeonNeurNetzKonzeptPapier.md`, `AeonNeurNetzPublikation.md`~~                                                                                                                                                                                                                                                                                                                                                                                                                                                       | ~~Mittel~~ | **Erledigt (2026-07-26)**: gegen den Code abgeglichen (siehe MIGRIERT-Eintrag oben) — Konzepte für eine aktive, über den heutigen Code hinausgehende Vision (Q1 2026 – Q2 2027), nicht für bereits gebauten Code. Alle 9 Blueprint-Dokumente nach `aeon-trikaya/docs/blueprints/` mitgenommen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `analysis/devtalkNNN-evaluation.md` (27 Dateien)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Niedrig    | Sind Auswertungen/Bewertungen von `DevTalk.txt`-Abschnitten — eher log-nah als eigenständige Blueprints; brauchen eigene Sichtung ob sie Konzept- oder Rückblick-Charakter haben.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `experiments/emergence_study/emergence_analysis.ipynb` (2. Durchgang, 2026-07-26)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Niedrig    | Reines Konzept, kein Code: das Notebook hat genau eine Markdown-Zelle ("Steps: load graph data, train GNN, compute AUC, correlate with CREP logs"), keine einzige Code-Zelle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `agents/*` — 29 von 32 Unterordnern (2. Durchgang, 2026-07-26): `art`, `catalyst`, `contrastive_training`, `cosmic_events`, `defensive_shield`, `desert_tracker`, `digital_twin`, `drift_detection`, `echo`, `ethics_policy`, `federated_meta`, `forest_dynamics`, `gamification`, `glacier_balance`, `global_events`, `governance_simulator`, `impact`, `iot_sensor`, `island_loss`, `meta_tuner`, `news_climate` (5 Service-Dateien), `newsbot`, `provenance`, `review`, `review_checkpoint`, `security_scanner`, `sentiment`, `singularity_simulator`, `symbolmapper` | Niedrig    | Identisches Muster über alle 29: ein winziger FastAPI-Microservice (Python) oder eine freistehende Funktion (TS), die hartkodierte/Dummy-/Platzhalter-Werte zurückgibt (12–125 Zeilen, viele davon explizit als "placeholder"/"dummy"/"stub" selbst-dokumentiert, z. B. `climate_service.py`: "This stub currently returns zero values"; `newsbot/orchestrator.py`: "The methods are placeholders"). `desert_tracker` und `art` haben etwas mehr echte Logik (Fallback-Handling bzw. ein echter, wenn auch trivialer ASCII-Art-Generator), ändern aber nichts am Gesamtbild: kein funktionierendes Multi-Agent-System, nur ein Gerüst mit 29 Domain-Namen. Einzige echte Ausnahme: `personhood` — mittlerweile extrahiert als `aeon-jurist` (P55), siehe MIGRIERT-Tabelle oben.                                                                                                                            |
| `sims/{fractal_universe_tree,universe_tree_optimism}.py` (3. Durchgang, 2026-07-26)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Niedrig    | Beide vollständig gelesen (80 + 53 Zeilen). `fractal_universe_tree.py` ist im eigenen Docstring selbst als "Toy... simulation" mit "EVC and CREP placeholders" beschrieben — `evc = random.random()`/`crep = random.random()` sind buchstäblich Zufallsrauschen, keine echte Berechnung; die Baum-Verzweigungsmechanik selbst (Branching, CSV-Export) ist real, aber ohne echtes Fitness-Signal. `universe_tree_optimism.py` ist ein eigenständiges Spielzeug-Scoring-Modell (Tech- vs. Society-Branch für "sustainable mobility") mit frei erfundenen Parametern (0.9/0.5/0.7 etc.), ohne jeden GenesisAeon-Bezug.                                                                                                                                                                                                                                                                                        |
| `demos/universe_pulse_e2e.ts` (3. Durchgang, 2026-07-26)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Niedrig    | Echtes, funktionierendes E2E-Demo-Skript für `packages/universum-simulationen`s `simulatePulse()` — Import und Funktionssignatur verifiziert (existiert wirklich, kein toter Link). Da `packages/` laut Struktur-Hinweis oben bereits "aktiver Code dieses Repos selbst" ist, ist dieses Demo nur ein dünner, echter Nutzungsbeleg dafür — kein eigenständiger Archäologie-Fund.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `examples/go-agent/prioritization-example.yaml` (3. Durchgang, 2026-07-26) + `docs/go-agent/{ml-prioritization,policy-guide}.md` (5. Durchgang, 2026-07-26)                                                                                                                                                                                                                                                                                                                                                                                                              | Niedrig    | Beispiel-Jobkonfiguration (`job`/`features.size,urgency`/`policy.tags,maxRuntime`) — **verifiziert, nicht angenommen**: dieses Schema wird von keinem Go-Code in `go-agent` tatsächlich geparst (repo-weite Suche nach `maxRuntime`/`policy.tags` ergab nichts). Das echte `pkg/plugin/prioritizer.go` kennt nur ein einfaches `TaskInput{ID, Score}` gegen einen externen ML-Dienst (`localhost:9000/rank`). **Bestätigt durch die zugehörigen Docs**: `ml-prioritization.md` behauptet, Modelle lägen unter `go-agent/pkg/ml/` — dieses Verzeichnis existiert nicht. `policy-guide.md` behauptet, Policies lägen unter `config/policies/` — auch das existiert nicht (`config/` hat nur `memory-jobs`, `nginx`, `onboarding`). Beide Docs beschreiben durchgängig Vision statt vorhandener Funktionalität, nicht nur das eine Beispiel — als offene Frage auch in `go-agent/GOVERNANCE.md` nachgetragen. |

Ursprünglich hier vorgemerkt, jetzt im 2. Durchgang (2026-07-26)
gesichtet: `experiments/`, `agents/` (32 Unterordner), Go-Code
(`go-agent/`, `go-bridge/`, `simulations/universe-sim/`,
`packages/{socialgoodmesh,userfriendship}`,
`services/{chat-writer,vector-indexer}`) — siehe Paket-Kandidaten-,
Blueprint- und Manuelle-Entscheidungen-Tabellen oben/unten sowie den
eigenen Abschnitt "Zweiter Durchgang" weiter unten. `sims/`, `demos/`,
`examples/` bleiben weiterhin ungesichtet.

---

## 📜 Gesprächslogs

| Datei/Ordner                                                     | Größe                                                                                                                                          | Inhalt (grob)                                                                                                |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `DevTalk.txt` (Repo-Root)                                        | 653 KB                                                                                                                                         | Entwickler-Tagebuch/Konversationsprotokoll (bereits aus früherer Session bekannt, gehört Johann als Person). |
| `GenesisAeonZIPMEM/newadvancedconversations.zip`                 | 20 MB                                                                                                                                          | Gezipptes Konversationsarchiv.                                                                               |
| `GenesisAeonZIPMEM/conversations.zip`                            | 20 MB                                                                                                                                          | Gezipptes Konversationsarchiv.                                                                               |
| `GenesisAeonZIPMEM/advancedconversations.zip`                    | 20 MB                                                                                                                                          | Gezipptes Konversationsarchiv.                                                                               |
| `GenesisAeonZIPMEM/commitMemory/<sha>/{changes.patch,meta.yaml}` | 1.8 MB, 137 Unterordner                                                                                                                        | Pro-Commit-Archiv (Patch + Metadaten) — Entwicklungshistorie als Dokument, kein aktiver Code.                |
| `GenesisAeonZIPMEM/newadvancedconversations/*`                   | 1.3 MB, 4 thematische Ordner (`AEON-KI-RESONANZ`, `AEON-PROJEKT-WEITERENTWICKLUNG`, `2025-0626-PFADVERBUNDUNG`, `Sigil-Uebergang-und-Kontext`) | Themen-sortierte Gesprächsauszüge.                                                                           |
| `analysis/conversations.filtered.{csv,json}`                     | —                                                                                                                                              | Gefilterte/aufbereitete Gesprächsdaten.                                                                      |

Kein Inhalt dieser Logs wurde gelesen (nur Größen/Struktur) — wie in den
Hinweisen des Prompts gefordert.

---

## 🔴 Veraltete / Superseded Inhalte

Kein Cluster in diesem Durchgang mit ausreichender Sicherheit als veraltet
identifiziert. Eine echte Veraltet-Bewertung braucht den MIGRIERT-Abgleich
(s. o.) als Voraussetzung — ohne den lässt sich "superseded" nicht von
"noch nicht extrahiert" unterscheiden.

---

## ❓ Manuelle Entscheidungen nötig

| Cluster                                           | Warum unklar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Optionen                                                                                                                                                                                                                                |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~`sims/`, `demos/`, `examples/`~~                | **Gelöst (2026-07-26, 3. Durchgang)**: alle 5 Dateien (181 Zeilen) vollständig gelesen, kein neuer Paket-Kandidat. Siehe eigenen Abschnitt "Dritter Durchgang" unten.                                                                                                                                                                                                                                                                                                                                                                                                                                                   | —                                                                                                                                                                                                                                       |
| ~~`go-agent/` + `go-bridge/` — Governance-Frage~~ | **Gelöst (2026-07-26)**: `GOVERNANCE.md` + `CHANGELOG.md` für beide geschrieben, `git tag go-agent/v0.1.0` + `go-bridge/v0.1.0` gesetzt. Bleiben Teil des Kernrepos (nicht extrahiert, kein Go-Äquivalent zur `aeon-*`-Paket-Konvention nötig), eigenes Semver unabhängig vom Python-Ökosystem. Dabei verifiziert (nicht angenommen): `go-bridge`s `meta-scores get` ruft echt `apps/sharedream-interface`s `/api/meta-scores`-Route auf (Node/TS, nicht Python!) — die im Auftrag angenommene Python-Ökosystem-Beziehung existiert so nicht. `go-agent` selbst hat keinen verifizierten Aufrufer/Aufgerufenen im Repo. | Offen geblieben, siehe `GOVERNANCE.md` je Modul: `crep.events`-NATS-Subject hat Consumer aber keinen Producer; `MetaScoreService`-gRPC-Server nicht gefunden; Modul-Pfad-Inkonsistenz (`unified-mandala`- vs. `GenesisAeon`-Namespace). |
| `services/{chat-writer,vector-indexer}` (Go)      | Reale, funktionierende, aber generische Mini-Services (JSON-Message-Writer, Embedding-Indexer) ohne erkennbaren `UTAC`/`CREP`/`Gamma`/GenesisAeon-Bezug im Code, und ohne im 5. Durchgang gefundenen Bezug zum Friendship&SocialGood-Feature unten.                                                                                                                                                                                                                                                                                                                                                                     | Eigenständige Nebenprojekte, spätere Integration, oder Kandidaten zum Entfernen? Keine Empfehlung ohne Johanns Einschätzung.                                                                                                            |
| `agents/_shared/` (2. Durchgang, 2026-07-26)      | Echtes Agent-Framework, aber nur von 1 von 32 Agenten genutzt (siehe Paket-Kandidaten-Tabelle)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Ausbauen + Rest-Migration, oder archivieren?                                                                                                                                                                                            |
| MIGRIERT-Status generell                          | Ohne Datei-Hash-/Namens-Diff gegen alle ~52 Ökosystem-Repos nicht seriös feststellbar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Dedizierter Abgleichs-Task                                                                                                                                                                                                              |
| PACKAGE_ID-Register (P52/53/54 und folgende)      | Kein zentrales Register gefunden — `genesis-os/scripts/templates/zenodo.json` ist nur eine leere Vorlage, echte `PACKAGE_ID`-Werte liegen verstreut in den `zenodo.json`/`system.py`-Dateien der ~52 Einzelrepos (nicht alle lokal vorhanden, kein `gh`-Zugriff hier)                                                                                                                                                                                                                                                                                                                                                   | Vorläufig fortlaufend weiternummerieren (P55+); ein echtes Register bräuchte einen Scan aller GitHub-Repos, den Johann bei Gelegenheit mit dem numerierenden Claude-Code-Kontext machen möchte                                          |

---

## Empfohlene nächste Schritte (nach Priorität)

1. ~~**Sofort:** `GenesisAeonAdvancedAi/` gegen das bestehende `aeon-ai`-Paket abgleichen~~ — **erledigt (2026-07-26)**: kein Duplikat, extrahiert als `aeon-trikaya` (P52), siehe MIGRIERT-Eintrag oben.
2. ~~**Kurzfristig:** `GenesisAeonZIPMEM`'s SealCore-Cluster (7 Dateien, echte
   Logik) aus dem Log-Verzeichnis lösen, bevor er versehentlich mit den
   Konversations-Zips mitgelöscht/übersehen wird.~~ — **erledigt (2026-07-26)**:
   extrahiert als `aeon-sealcore` (P54), siehe MIGRIERT-Eintrag oben.
3. ~~**Mittelfristig:** verbleibende ungesichtete Cluster (`experiments/`,
   `agents/`, `simulations/`, `sims/`, `demos/`, `examples/`, Go-Code)
   in einem Folge-Durchgang mit derselben Heuristik prüfen.~~ —
   **erledigt über 2.–4. Durchgang (2026-07-26)**: `experiments/`,
   `agents/` (32 Unterordner), gesamter Go-Code, `sims/`, `demos/`,
   `examples/` sowie die verbleibenden Top-Level-Verzeichnisse
   (`plugins/`, `sigils/`, `orchestrator/`, `codex*` u. a.) gesichtet —
   siehe Abschnitte "Zweiter"/"Dritter"/"Vierter Durchgang" unten.
   Bewusst ausgeklammert: reine Infra-/DevOps-Verzeichnisse und
   `docs/` (758 Dateien, zu groß, siehe Vierter Durchgang).

---

## Zweiter Durchgang (2026-07-26): experiments/, Agent-Ordner, Go-Code — Befund

**`experiments/` (5 Unterordner, ~10 Dateien, alle gelesen):** vier
davon (`ab_test`, `energy_profile`, `self_tuner`, `stress_test`) sind
reale, aber kleine (19–45 Zeilen) Test-/Tuning-Werkzeuge für den
bereits bekannten `unifiedmandala-neural`/`unifiedmandala-orchestrator`-
Cluster (referenzieren dessen `sigillin-event`-Endpoint,
`pipeline_config.yaml` und die `snn_service`/`lstm_service`-Container
direkt) — kein eigener Extraktions-Kandidat, siehe Ergänzung in der
Paket-Kandidaten-Tabelle oben. `emergence_study` ist reines Konzept
(ein Notebook mit einer einzigen Markdown-Zelle, kein Code).

**32 `agents/`-Unterordner:** 30 tatsächlich vorhanden (`__pycache__`
und `_shared` mitgezählt in der ursprünglichen Find-Ausgabe, aber keine
Domain-Agenten). Breite Stichprobe (10 vollständig gelesen, alle 30 per
Zeilenzahl/Stub-Marker-Scan geprüft) ergibt ein klares Bild: **29 von 30
folgen demselben Muster** — ein winziger FastAPI-Service oder eine
freistehende TS-Funktion, die hartkodierte/Dummy-Werte zurückgibt, viele
davon selbst-dokumentiert als "placeholder"/"stub"/"dummy". `news_climate`
sticht mit 351 Zeilen hervor, entpuppt sich bei genauerem Lesen aber nur
als mehr Dateien desselben Platzhalter-Musters (5 Service-Dateien, alle
geben Nullwerte/Dummy-Daten zurück), nicht als mehr echte Logik. **Einzige
echte Ausnahme: `personhood/AIJuristicAgent.ts`** — eine selbstgeschriebene
TF-IDF-Kosinus-Suche gegen echte Präzedenzfall-Dokumente
(`data/personhood/cases/`), siehe Paket-Kandidaten-Tabelle. Zusätzlicher
Fund: `agents/_shared/` enthält ein echtes, kleines Agent-Laufzeit-Framework
(typisiertes `Agent`-Interface, Circuit-Breaker, Guardrails, Rate-Limit,
Retry, Logger, HTTP-Helfer — ~160 Zeilen), das aber nur von einem einzigen
Agenten (`echo`, dem trivialsten von allen) tatsächlich verwendet wird.

**Go-Code (123 Dateien, 7 `go.mod`-Module, ~4034 Zeilen inkl. generiertem
Protobuf-Code):** `go-agent` (1083 Zeilen) und `go-bridge` (1271 Zeilen)
sind echte, aktive Infrastruktur mit direktem GenesisAeon-Bezug — ein CLI
(`mandala-cli`) mit `meta-scores get`/`crep watch`-Kommandos (Streaming von
CREP-Events über NATS), ein Scheduler-Service mit Vault-Auth und Metrics-
Endpoint. `simulations/universe-sim` (916 Zeilen) ist eine funktionierende
Multi-Agent-Gitter-Simulation mit gRPC-Federation-Server, aber ohne direkten
`UTAC`/`CREP`/`Gamma`-Bezug im Code. `packages/{socialgoodmesh,
userfriendship}` und `services/{chat-writer,vector-indexer}` (zusammen 467
Zeilen) sind funktionierende, aber generische Mini-Services ohne
erkennbaren GenesisAeon-Bezug.

**CREP-Stub-Verbreitung (gesamtes Repo, alle `.py`-Dateien gescannt):**
genau 2 Fundstellen mit hartkodierten `evaluate_crep()`-Werten —
`GenesisAeonAdvancedAi/crep_eval.py` und `GenesisAeonZIPMEM/agents/crep_bridge.py`
— beide bereits bekannt und in `aeon-trikaya`/`aeon-sealcore` explizit
dokumentiert (nicht gefixt, siehe MIGRIERT-Einträge oben). Der echte,
funktionierende `CREPEvaluator` in `src/unified_mandala/core/crep.py`
(aktiver Code dieses Repos selbst) ist kein Stub. Kein Fix in diesem
Sprint — Stub-Behebung gehört laut Vorgabe zur `scope-resilience`-
Integration (P41), nicht zur Archäologie.

---

## Statistik (Cluster-Ebene, nicht datei-genau)

### Erster Durchgang (2026-07-26)

| Kategorie           | Anzahl Cluster |
| ------------------- | -------------- |
| MIGRIERT (Verdacht) | 3              |
| PAKET_KANDIDAT      | 1              |
| BLUEPRINT           | 2              |
| LOG                 | 6              |
| VERALTET            | 0              |
| UNKLAR              | 3              |
| **Gesamt**          | **15**         |

_(`GenesisAeonAdvancedAi/` durchlief in dieser Session mehrere Stufen:
zunächst doppelt gezählt (PAKET_KANDIDAT + offene UNKLAR-Frage zur
`aeon-ai`-Überlappung), nach dem Diff vom 2026-07-26 nur noch
PAKET_KANDIDAT, und nach der vollständigen Extraktion nach `aeon-trikaya`
(P52, ebenfalls 2026-07-26) jetzt MIGRIERT. Der SealCore-Cluster in
`GenesisAeonZIPMEM/` durchlief denselben Weg: PAKET_KANDIDAT → nach
vollständiger Extraktion nach `aeon-sealcore` (P54, 2026-07-26) jetzt
MIGRIERT.)_

### Zweiter Durchgang (2026-07-26): experiments/, Agent-Ordner, Go-Code

| Kategorie      | Anzahl Cluster                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| MIGRIERT       | 0 (zum Zeitpunkt des 2. Durchgangs — `personhood` wurde danach noch am selben Tag extrahiert, siehe unten)                    |
| PAKET_KANDIDAT | 3 (`personhood`, `agents/_shared`, `simulations/universe-sim`)                                                                |
| BLUEPRINT      | 2 (`emergence_study`, 29 `agents/*`-Ordner als ein Cluster gezählt)                                                           |
| LOG            | 0                                                                                                                             |
| VERALTET       | 0                                                                                                                             |
| UNKLAR         | 3 (`go-agent`+`go-bridge`, generische Go-Services, `agents/_shared`-Adoption)                                                 |
| **Gesamt**     | **~7 neue Cluster-Einträge** (`experiments/`s 4 Test-Tools als Ergänzung zu einem bestehenden Eintrag gezählt, nicht separat) |

### Follow-up (2026-07-26, gleicher Tag): P55 + Go-Governance

- `agents/personhood/AIJuristicAgent.ts` → extrahiert als `aeon-jurist`
  (P55). PAKET_KANDIDAT → MIGRIERT, siehe MIGRIERT-Tabelle oben.
- `go-agent`/`go-bridge` → Governance-Frage aus der UNKLAR-Tabelle
  gelöst (`GOVERNANCE.md`, `CHANGELOG.md`, `v0.1.0`-Tags je Modul),
  bleiben aber Teil des Kernrepos, nicht MIGRIERT im Sinne dieser
  Tabelle (nichts wurde extrahiert). Dabei widerlegt: die im
  ursprünglichen Auftrag angenommene Python-Ökosystem-Beziehung —
  `go-bridge`s echte, verifizierte Integration ist mit
  `apps/sharedream-interface` (Node/TypeScript), nicht mit einem
  Python-Paket.

### Dritter Durchgang (2026-07-26): sims/, demos/, examples/

Alle drei Verzeichnisse waren winzig (181 Zeilen gesamt über 5
Dateien) — vollständig gelesen, keine Stichprobe nötig. Kein neuer
Paket-Kandidat:

- `sims/fractal_universe_tree.py`: im eigenen Docstring als "Toy...
  simulation" mit "EVC and CREP placeholders" deklariert — die
  Fitness-Werte sind buchstäblich `random.random()`, keine echte
  Berechnung. Baum-Verzweigungsmechanik selbst ist real.
- `sims/universe_tree_optimism.py`: eigenständiges Spielzeug-
  Scoring-Modell ohne GenesisAeon-Bezug, frei erfundene Parameter.
- `demos/universe_pulse_e2e.ts`: echtes, funktionierendes Demo für
  `packages/universum-simulationen`s `simulatePulse()` — verifiziert
  (kein toter Import), aber da `packages/` bereits als aktiver
  Repo-eigener Code gilt, kein eigenständiger Fund.
- `examples/go-agent/prioritization-example.yaml`: beschreibt ein
  Job-Schema, das **verifiziert** von keinem aktuellen `go-agent`-Code
  geparst wird (`pkg/plugin/prioritizer.go` kennt nur ein einfaches
  `TaskInput{ID, Score}`) — Beispiel ist der Implementierung voraus,
  als offene Frage in `go-agent/GOVERNANCE.md` nachgetragen.

Damit sind `sims/`, `demos/`, `examples/` jetzt vollständig gesichtet.

### Vierter Durchgang (2026-07-26): verbleibende Top-Level-Verzeichnisse

Breiter Scan aller bis dahin ungeprüften Top-Level-Verzeichnisse
(Dateizahl je Verzeichnis), dann gezielt vertieft bei den
GenesisAeon-nahen Clustern, reine Infra-/DevOps-Verzeichnisse
(`aws/`, `ci/`, `k8s/`, `grafana/`, `deployment/`, `config/`,
`charts/`, `infrastructure/`) bewusst übersprungen (außerhalb des
Scopes dieser Inhalts-Archäologie).

- **`plugins/`**: wichtigster Einzelfund dieses Durchgangs — siehe
  Paket-Kandidaten-Tabelle oben (`mandalaHaiku` echtes, genehmigtes
  Plugin; Registry-Governance-System erklärt die 29 Platzhalter-Agenten
  aus dem 2. Durchgang als registrierte, aber teils nicht genehmigte
  Plugins).
- **`orchestrator/`** (nicht `unifiedmandala-orchestrator/`): echter,
  getesteter NewsBot-Pipeline-Code — siehe Paket-Kandidaten-Tabelle.
- **`sigils/`**: klärt konkret, was unified-mandalas "Inter-AI-Bridge"-
  Selbstbeschreibung technisch bedeutet (siehe Strukturüberblick oben) —
  kein neuer Cluster, aber wichtiger Kontext.
- **`schemas/`, `types/`, `codex*`, `advancedToDo_parts/`**: unterstützende
  Infrastruktur bzw. Build-/Feedback-Log-Daten, keine Domänenlogik.
- Reine Konfig-/Daten-Verzeichnisse ohne Code (`data/`, `fixtures/`,
  `manifest/`, `prompts/`, `public/`, `keys/` [leer]) nicht einzeln
  vertieft — passen zum bereits etablierten Muster (Konfiguration,
  keine eigenständige Logik).
- `docs/` (758 Dateien) bewusst nicht im Detail durchforstet — zu groß
  für diesen Durchgang, überwiegend Dokumentation statt versteckter
  Code-Cluster (Stichprobe bestätigt: bekannte Themen wie
  `docs/sigillin/bridges/*_SIGILLIN.md`, passend zu `sigils/`).

| Kategorie      | Anzahl Cluster                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| MIGRIERT       | 0                                                                                                        |
| PAKET_KANDIDAT | 2 (`orchestrator/`, `plugins/`s `mandalaHaiku`)                                                          |
| BLUEPRINT      | 0 (keine neuen — Ergänzungen zu bestehenden Einträgen)                                                   |
| LOG            | 1 (`codex*`/`advancedToDo_parts` als ein Cluster gezählt)                                                |
| VERALTET       | 0                                                                                                        |
| UNKLAR         | 0                                                                                                        |
| **Gesamt**     | **~3 neue/ergänzte Einträge** (`sigils`/`schemas`/`types` als Kontext, nicht als eigene Cluster gezählt) |

Alle vier Durchgänge zusammen sind weiterhin **kein vollständiger
Datei-Zensus** — siehe Hinweis zum Umfang oben. Noch offen: die reinen
Infra-/DevOps-Verzeichnisse (bewusst ausgeklammert, s. o.) und `docs/`
im Detail (758 Dateien) — siehe Fünfter Durchgang unten.

---

## Fünfter Durchgang (2026-07-26): `docs/` (758 Dateien)

Geplant und mit Johann abgestimmt (Plan vorher vorgelegt), dann
phasenweise ausgeführt. **Ausgeschlossen** als auto-generiert/Assets:
`docs/api/` (298 Dateien, generierte API-Docs), `docs/pics/`,
`docs/images/`, `docs/assets/`, `docs/swagger/`. **Als Duplikat
bereits klassifizierter Log-Daten übersprungen**: `docs/fraktal/`
(66 Dateien, fast nur `codexfeedback/*.yaml`), `docs/fraktale/`.

**Phase 0 — Parsing-Tools für die ZIP-Logs** (Johanns Hinweis, dass es
die geben müsste — stimmte): `scripts/analyze_zip.py` (ZIP-Struktur-
Analyse, keine Inhalte), `scripts/parse-advanced-conversations.js`
(extrahiert Keyword-Treffer bzw. `TODO:`-Zeilen aus Voice-Note-
Transkripten in `advancedToDo_parts/`), `scripts/organize-zipmem.js` +
`scripts/generate-zipmem-fragments.js` (zerlegen die großen
Konversations-JSONs in Einzelgespräch-Ordner bzw. Nachrichten-YAML-
Fragmente — genau der Mechanismus, den `GenesisAeonZIPMEM/
newadvancedconversations/` als Ergebnis enthält), `scripts/
quantum-archive-ingest.ts` (liest `docs/archive/archiv-
menschheitsspuren.md`, füttert Zeilenlängen als "CPT-Delta" in einen
`QuantumTheoryAgent` — dekorative Pseudo-Physik, keine echte
Messgröße, aber echter, lauffähiger Code), `scripts/archive-
menschheitsspuren.js` (hängt Einträge an dasselbe Archiv an).

**Wichtiger Nebenfund**: `docs/sigils/newadvancedconversations.json`
(~104 MB) und `docs/sigils/conversations.json` (~100 MB) sind die
echten, vollständigen Rohexporte von Johanns Konversationen — nur
Dateigröße geprüft, Inhalt nicht gelesen (Privatsphäre, wie bei den
`.zip`-Archiven in `GenesisAeonZIPMEM`).

**Korrektur einer eigenen Schlussfolgerung**: `docs/api/friendship-
socialgood.yaml` (echte OpenAPI-Spec, Titel **"Friendship & SocialGood
API"**) plus zwei bis dahin nicht gefundene Apps (`apps/socialgood-ui`,
`apps/socialgood-mobile`) zeigen, dass Johanns ursprüngliche
"Freundschaftssystem"-Erinnerung aus dem 4. Durchgang richtiger war
als meine damalige Log-basierte Korrektur — siehe aktualisierten
Eintrag in der Paket-Kandidaten-Tabelle oben (aus der
❓-Tabelle verschoben, da der Zweck jetzt geklärt ist).

**`docs/archive/` vs. `docs/archaeology/`** — keine Duplikate, wie der
Name vermuten lässt: `docs/archive/archiv-menschheitsspuren.md` ist
die Hauptliste (u. a. Blombos Cave, Göbekli Tepe, Sphinx, Antikythera-
Mechanismus, Nazca-Linien — echte, bekannte archäologische/anomale
Fundorte), `docs/archaeology/archiv-menschheitsspuren.md` ist
explizit eine externe "Erweiterung" mit 3 weiteren Einträgen
(Çatalhöyük, Laetoli, Olduvai-Schlucht) aus einem separaten Chat.
Beide haben eigene Tests (`archive.test.ts`).

**`docs/pantheon/`** (13 Dateien): die "Organisationsstruktur" für das
gesamte Agenten-/LLM-Bridge-Universum — ordnet u. a. `claude`,
`chatgpt`, `mistral-devstral` als Trikaya-Ebenen-Instanzen
(Sambhogakaya/Nirmāṇakāya) neben Kernagenten wie `mandala-
orchestrator`, `crep-scanner`, `poetics-core` ein. Passt zum
`PANTHEON_DISABLE=1`-Env-Var, der im `go-agent`/`unified-mandala`-
Pre-Push-Hook gesetzt wird (echtes, im CI bewusst abgeschaltetes
System). Überwiegend Blueprint (`MandalaOrchestratorControl.md` ist
explizit als "Blueprint für zukünftige Implementierungen"
selbstbeschriftet), mit einem winzigen echten Generator-Skript
(`generate_pantheon_manifest.ts`, schreibt ein JSON-Manifest) und
YAML-Manifesten mit echten Modul-Pfaden (`packages/agents/
CosmicTheoryAgent.ts`, `packages/unifiedmandala-ui/index.ts`).

**`docs/agents/`** (26 Dateien): eine **zweite, andere Agenten-
Taxonomie** als die 32 Stub-Ordner in `agents/` aus dem 2. Durchgang —
Transpiler-Agenten pro Sprache (Go/JS/Python/Rust), `SoundAgent`,
`VisualAgent`, `SymbolAgent`, `EvolverGPT`, `StrategicAgentCoordinator`
u. a. Stichprobenprüfung zeigt: **teils real**. `AeonPythonTranspilerAgent.ts`
und `AeonGoTranspilerAgent.ts` existieren echt in `packages/agents/`
(mit Tests, importieren eine reale `aeon-universal`-Compile/Transpile-
Bibliothek und ein gemeinsames `Agent`-Interface mit FSM-Mixin) —
`SoundAgent`/`VisualAgent`/`SymbolAgent` dagegen wurden nirgends als
Code gefunden, nur als `.md`-Dokument — bleiben Blueprint. Da
`packages/` bereits als aktiver Code dieses Repos gilt, kein neuer
Extraktions-Kandidat, aber wichtiger Beleg, dass dieses zweite
Agenten-System deutlich reifer ist als die 32 Platzhalter-Stubs.

| Kategorie      | Anzahl Cluster                                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| MIGRIERT       | 0                                                                                                                                  |
| PAKET_KANDIDAT | 1 (Friendship & SocialGood — aus ❓ verschoben, siehe oben)                                                                        |
| BLUEPRINT      | 1 (`docs/pantheon/` — überwiegend Konzept, siehe Details oben)                                                                     |
| LOG            | 0 (Parsing-Tools sind aktiver Code, keine Log-Daten)                                                                               |
| VERALTET       | 0                                                                                                                                  |
| UNKLAR         | 0                                                                                                                                  |
| **Gesamt**     | **~2 neue Cluster + 1 aufgelöste ❓-Frage** (`docs/agents/` als Kontext zu `packages/agents/` gezählt, kein eigener neuer Cluster) |

### Fünfter Durchgang, Phase 4 (2026-07-26): Querverweis-Batch

Kleine, gezielte Cluster, die zu bereits bekannten Themen gehören —
alle vollständig gelesen:

- **`docs/personhood/PersonhoodProtocol.md`**: **kein Bezug zu
  `aeon-jurist` (P55)** trotz gleichen Namensraums — beschreibt ein
  allgemeines Agenten-Ethik-Protokoll (Consent/Provenance/Audit/
  Refusal/Review) für Agenten mit "emergenter Identität", nicht die
  Rechtspersönlichkeits-Klassifikation für Flüsse/KI. Reine
  Namensüberschneidung, zur Klarheit vermerkt.
- **`docs/aeon-seal-ai/blueprint.md`**: beschreibt Seal-Registrierung
  über `AeonSigillinVault` mit Schlüsselaustausch via "Genesis API".
  `AeonSigillinVault` existiert echt (`packages/core/
AeonSigillinVault.ts`, mit Test) — ist aber tatsächlich nur ein
  einfacher In-Memory-Log für "poetische Zustände"
  (record/recordTransition/recordResonance/recordGuard), keine
  Sicherheits-/Registrierungslogik wie im Blueprint behauptet. Name
  existiert, beschriebene Funktion nicht.
- **`docs/go-agent/{ml-prioritization,policy-guide}.md`**: siehe
  aktualisierten Eintrag in der Blueprint-Tabelle oben — bestätigt und
  erweitert den Fund aus dem 3. Durchgang (`go-agent/pkg/ml/` und
  `config/policies/` existieren beide nicht).
- **`docs/sigillin/FIX_GUIDE.md`**: **positiver Gegenfund** — beschreibt
  `scripts/fix-sigillin.ts`, ein echtes, funktionierendes Lint-/Fix-Tool
  für die Sigillin-Bridge-Dateien (prüft Trikāya-Referenzen, CREP-
  Vollständigkeit, berechnet einen Poetik-Score) — verifiziert: Skript
  existiert, `package.json` hat echte `sigil:fix`/`sigil:fix:interactive`-
  Kommandos dafür. Nicht jede Doku in `docs/` ist Vision — dieser
  Kontrastfund zeigt, dass Behauptungen einzeln geprüft werden müssen,
  nicht pauschal als Blueprint oder als real angenommen werden dürfen.
- `docs/sigillin.examples/`: triviale Referenzbeispiele, nichts
  Weiteres zu vermerken.

**`docs/sigils/` selbst nachgeholt** (74 Dateien — beim ersten Blick
nur wegen der beiden ~100MB-Rohexport-JSONs erfasst, jetzt vollständig
durchgesehen, auf Johanns Nachfrage):

- **`silent-agents.ts`** (+ eine Variante `silent-agents(1).ts`, per
  Diff verifiziert: nur ein auskommentierter Testblock unterscheidet
  sie): echter, funktionierender kleiner Agentencode — drei konkrete
  Klassen (`ListeningAgent`, `MirrorAgent`, `SilenceAgent`) mit einem
  gemeinsamen `SilentAgent`-Interface und `process(signal: CREPSignal)`.
  Liegt aber nur in `docs/`, nicht in `packages/` — kein aktiver Code
  dieses Repos im engeren Sinn, aber auch kein Blueprint: echte,
  kleine, isolierte Logik ohne Integration.
- **Sigillin-Indexer-Toolchain bestätigt real** (`README.md`,
  `SCHEMA.md`, `FORMATS.md`, `manifest_export.test.ts`): `pnpm
sigils:index`/`sigils:index:strict` → `scripts/build-sigillin-index.mjs`,
  `scripts/export-sigil-manifest.ts` — beide verifiziert vorhanden,
  ins CI eingebunden (`ci:sigils`). Normalisiert CREP-Werte aus
  mehreren Schreibweisen (`score`, `C/R/E/P`, `coherence/resonance/
emergence/poetics`, verschachtelt). Passt zum bereits gefundenen
  `scripts/fix-sigillin.ts` — dieser ganze Werkzeugkasten ist real und
  gepflegt, nicht nur dokumentiert.
- **`conversations-stats.md`**: aggregierte Statistik über Johanns
  eigenes Konversationsarchiv (262 Konversationen, 28.888 Nachrichten,
  2.279 TODOs, Zeitraum ca. März 2023–Juni 2025) — nur die Zahlen hier
  übernommen, nicht die enthaltene Titelliste (Metadaten über
  Metadaten, aber aus Zurückhaltung nicht dupliziert).
- **ZIP-Bundles** (nur Struktur via `analyze_zip.py` geprüft, nicht
  entpackt): `genesismodul_mandala_silentagents_2035.zip` (7 Dateien,
  passt zu `silent-agents.ts`), `CodexAgentBundle.zip` (10 Dateien,
  Doku-Bundle), `mandala_sync_{codex_sync,integration}_yamls.zip`
  (klein). **`AeonProj.zip` (104 Dateien, 2,75 MB, davon 46 `.tsx`,
  38 `.json`, 8 verschachtelte `.zip`)** ist deutlich größer als der
  Rest — nicht entpackt/geöffnet, aber als größtes noch unerforschtes
  Bundle hier vermerkt, falls ein sechster Durchgang gewünscht ist.
- **`SealCore.yaml`**: byte-identisch mit `GenesisAeonZIPMEM/
Codex-Instructions/SealCore.yaml` (per Diff verifiziert) — dieselbe
  Datei, bereits über `aeon-sealcore` (P54) bekannt, keine neue
  Information.
- Rest (viele kleine `sigillin_*`/`*_2035.yaml`-Dateien): poetische/
  konzeptionelle Sigillin-Artefakte im bereits etablierten Muster,
  nicht einzeln katalogisiert.

Noch nicht vertieft in `docs/`: `docs/genesis`, `docs/mandala`,
`docs/membrane`, `docs/research`, `docs/roadmap`, `docs/maps`,
`docs/blueprints`, sowie generische Projekt-Docs (Tutorials/Guides/
Runbooks/Onboarding) — niedrige Priorität, siehe ursprünglichen Plan.
