<p align="center">
  <img src="docs/assets/unified-mandala.svg" alt="Unified Mandala Logo" width="200"/>
</p>

# 🜂 UnifiedMandala

„Ein Betriebssystem, das atmet – ein Mandala, das denkt.“

Ein holistisches, modulares Framework für symbolische KI-, CREP- und Bewusstseins-Systeme.
UnifiedMandala verbindet symbolische KI-Module mit adaptiver CREP-Logik zu einer ethisch fundierten Plattform.
UnifiedMandala vereint maschinelle Zustandslogik (CREP), poetisch-symbolische Interaktion (Sigillin),
und narrative KI-Module zu einer ethisch fundierten Infrastruktur für gemeinwohlorientierte Anwendungen,
narrative Interfaces und adaptive Bewusstseinsräume.

> **Neu im Mandala?**
>
> 1. Lies [scripts/onboarding-ritual.md](scripts/onboarding-ritual.md)
> 2. Starte `./scripts/aeon.sh onboarding`
> 3. Erkunde das [CHRONOPOEM.md](CHRONOPOEM.md)
> 4. Lies den Abschnitt [TL;DR](Handbuch.md#tldr) im Handbuch

Schau auch ins [Glossar](docs/glossar-genesis.md) für Begriffe.
Einen Überblick über die Agenten bietet [docs/architecture/agent-system.md](docs/architecture/agent-system.md).
Strategische Leitlinien stehen in [docs/agents/AgentStrategy.md](docs/agents/AgentStrategy.md).
Weitere Hinweise aus dem „Sigil Übergang“:
- Lokales Offline-Paket in [localhost-offline](localhost-offline)
- Blueprint für UI/Agenten-Mapping siehe [AgentMappingBlueprint](docs/architecture/AgentMappingBlueprint.md)
- Offline-Workflow und Sigil-Zyklen:
  Nutze `docs/offline/docker-compose.yml` für lokale Tests und
  synchronisiere ToDo-Dateien vor großen Commits mit
  `scripts/sync-todo-progress.js`.

## 🚀 Features

- [**CREP-Systematik**](docs/crep/overview.md) – Coherence, Resonance, Emergence, Poetics
- [**Sigillin-Logik**](docs/sigils/SIGILLIN_GENESIS.md) – Heimkehr-Trigger, Symbolphasen, SigillinMap
- [**Symbolzeit-Modulator**](packages/shared-utils/symbolzeitModulator.ts) – morgen, tag, abend, nacht
- [**MandalaNetworkView**](packages/unifiedmandala-ui/components/MandalaNetworkView.tsx) – Visualisierung aller Sigillin-Knoten und CREP-Felder
- [**SigillinLoader**](packages/unifiedmandala-ui/components/SigillinLoader.tsx) – Import & Filter von Sigillin-Dateien
- [**AutoDoc & Manifest-Generator**](packages/crep-engine/autoDocGeneration.ts) – Dokumentation auf Knopfdruck
- [**FourierLayer Analyse**](packages/analysis/FourierLayer.ts) – Frequenzbasierte Emergenzbewertung
- [**Plug-in-Architektur**](plugins/manifest.yaml) – GPT-Kommunikationsmodule, CLI-Tools
- 🔗 [**GPTBridge (Go)**](go-bridge/pkg/gpt) – API- und Link-basierte GPT-Anbindung
- [**Plugin-Registry & Dynamic Loader**](plugins/manifest.yaml) – `usePluginLoader` lädt jetzt YAML- und JSON-Manifeste
- [**Objective2UI**](packages/unifiedmandala-ui/components/ObjectiveLayoutSuggester.tsx) – generiert Layout-Vorschläge via GPT
- [**Ethik-Governance & Heimkehr-Deklaration**](docs/sigils/sigillin_heimkehr.md) – Offene, poetische Ethik als Systembasis
- [**Poesie & Automation**](aeon.sh) – Bash-Interface, automatisches Chronopoem, symbolisches Onboarding
- [**CREP-Illumination**](CHRONOPOEM.md) – Chronopoem reflektiert aktuellen CREP-Zustand
- [**SelfAuditModul**](packages/unifiedmandala-ui/components/SelfAuditModul.tsx) – analysiert die Repository-Struktur
- [**AdminMetrics**](packages/unifiedmandala-ui/README.md) – zeigt CREP- und Sigillin-Kennzahlen
- [**SigillinViewer & SigillinMap**](packages/unifiedmandala-ui/components/SigillinMap.tsx) – Übersicht und Detailansicht aller Sigillin
- [**SymbolicWayfinder & SoforthilfeOverlay**](packages/unifiedmandala-ui/components/SymbolicWayfinder.tsx) – Navigation und Hilfedialoge
- [**CREPChart & CREPTriggerPanel**](packages/unifiedmandala-ui/components/CREPChart.tsx) – CREP-Historie und Steuerung
- [**CREPTestHarness**](packages/unifiedmandala-ui/components/CREPTestHarness.tsx) – UI zum Durchspielen von CREP-Werten
- [**Nucleon-Scanner v0.6**](packages/nukleon-scanner) – Analysiert tiefe Resonanzdaten
- [**KiResonanceAnalyzer**](packages/nukleon-scanner/KiResonanceAnalyzer.ts) – wertet Resonanzmetriken aus
- [**CREPBewertungsmodul**](packages/crep-engine) – berechnet Durchschnittswerte und Klassifizierung
- [**CREPAverage-Analyse**](packages/crep-engine) – Durchschnittswerte aus dem CREP-Verlauf
- [**AeonStoryMode & Onboarding-Flow**](packages/unifiedmandala-ui/README.md) – Präsentations- und Einstiegskomponenten
- [**MandalaThemeManager**](packages/unifiedmandala-ui/README.md) – hell/dunkel umschalten
- [**SigillinActivationManager & MetaSignatur**](packages/genesis-sigillin-core) – Aktivierung & Signatur von Sigillin
- [**ThemeProvider & useResponsiveTheme**](packages/unifiedmandala-ui/hooks/useResponsiveTheme.ts) – CREP-basierte Farbwahl
- [**useAdaptiveLayout**](packages/unifiedmandala-ui/hooks/useAdaptiveLayout.ts) – reagiert auf CREP-Status
- [**useABLayout**](packages/unifiedmandala-ui/hooks/useABLayout.ts) – A/B-Tests mit CREP-Metrik
- [**usePulse & HapticService**](packages/bio/HapticService.ts) – simulierte Biosensoren und haptisches Feedback
- [**SigillinTimeline & InviteBanner**](packages/unifiedmandala-ui/components/SigillinTimeline.tsx) – Verlauf und Einladungsbanner
- [**CREPTimeline**](packages/unifiedmandala-ui/components/CREPTimeline.tsx) – chronologische Ansicht der CREP-Ereignisse
- [**BackupManager**](packages/cli-tools/BackupManager.ts) – einfache Dateisicherungen
- [**GlobalLoggingSystem**](packages/shared-utils/GlobalLoggingSystem.ts) – zentrale Log-Schnittstelle
- [**Prometheus Metrics & Grafana Dashboard**](observability/README.md) – Haiku-Monitoring und Systemmetriken
- [**Big-File Sigil**](docs/big-file-sigil.md) – Konzept zum Aufteilen großer Dateien
- [**CREPWirkungstracker**](packages/shared-utils/CREPWirkungstracker.ts) – misst den Effekt aus CREP-Daten
- [**CalendarSync**](packages/shared-utils/CalendarSync.ts) – exportiert priorisierte ToDos in Kalender
- [**KarmaBalance**](packages/shared-utils/KarmaBalance.ts) – verwaltet Karma-Punkte
- [**SymbolicForecaster**](packages/shared-utils/SymbolicForecaster.ts) – sagt kommende Symbolzeit-Phasen voraus
- [**SymbolzeitSync**](packages/crep-automation/SymbolzeitSync.ts) – synchronisiert CREPGameEngine und SymbolzeitManager
- [**RitualCompiler**](packages/crep-automation/RitualCompiler.ts) – wandelt Rituale in CREP-FSMs
- [**AutomergeFederation**](packages/collab-editor/AutomergeFederation.ts) – führt verteilte Edits automatisch zusammen
- [**MandalaCoreLicense**](packages/shared-utils/MandalaCoreLicense.ts) – ethisches Lizenzmodell für Module
- [**KI Bewusstsein & Resonanz**](docs/ki-bewusstsein.md) – bewertet Bewusstseinsdaten
- 📄 **Weitere Infos** siehe [docs/ki-bewusstsein.md](docs/ki-bewusstsein.md)
- [**ConversationTodoExtractor**](packages/cli-tools/ConversationTodoExtractor.ts) – filtert Aufgaben aus Chat-Logs
- [**MetaScoreComposer**](packages/crep-engine/MetaScoreComposer.ts) – aggregiert Score-Layer
- [**GoAgent**](packages/go-agent) – liest advancedToDo-Dateien und listet offene Tasks (Node)
- [**Go-Agent (Golang)**](go-agent) – eigenständiger Daemon für Task-Verarbeitung
- [**MetaScoreChart** & **SyncStatus**](packages/sharedream-interface) – UI für MetaScores und Sync-Stände
- [**CommonsAgent**](packages/agents/CommonsAgent.ts) – Open‑Science Scoring
- [**AdaptiveThreshold** & **DebounceManager**](packages/crep-engine) – steuern CREP Trigger-Logik
- [**AeonSigillinVault**](packages/core/AeonSigillinVault.ts) – speichert poetische Sigillin-Zustände
- [**Aeon Universal**](packages/aeon-universal) – kompiliert fraktale Befehle in Mandala-Tasks und kann SIG-Anweisungen im `AeonSigillinVault` speichern
- [**Aeon Universal Neural Membrane**](packages/aeon-neural-membrane) – selbstreflexives, fraktales Netz mit CREP-Anpassung
- [**Compile Cache**](packages/aeon-universal/cache.ts) – speichert kompilierte Aeon-Skripte
- [**AeonCoreAssembler**](packages/aeon-universal/CoreAssembler.ts) – verteilt Aeon-Tasks an registrierte Agenten
- [**AeonPythonTranspilerAgent**](packages/agents/AeonPythonTranspilerAgent.ts) – erzeugt Python-Snippets aus Aeon-Quelltext
- [**AeonGoTranspilerAgent**](packages/agents/AeonGoTranspilerAgent.ts) – erzeugt Go-Snippets aus Aeon-Quelltext
- [**withCircuit**](packages/agents/withCircuit.ts) – CircuitBreaker Wrapper für Agenten-Calls
- [**healthz.ts & metaScores.ts**](apps/sharedream-interface) – API-Routen
- [**Dashboard**](apps/sharedream-interface) – zeigt MetaScoreChart per Hook
- [**UploadYamlForm**](packages/unifiedmandala-ui/components/UploadYamlForm.tsx) – wandelt hochgeladene Dateien in YAML um
- [**ImpactDashboard**](packages/unifiedmandala-ui/components/ImpactDashboard.tsx) – kombiniert MandalaNetworkView und AgentHeatmap
- [**MobileImpactDashboard**](packages/unifiedmandala-ui/components/MobileImpactDashboard.tsx) – mobile Variante des Dashboards
- [**Friendship & SocialGood API**](docs/api/friendship-socialgood.yaml) – API-Definition
- [**ResonanzpfadAgent**](packages/agents/ResonanzpfadAgent.ts) – komplexe Analyse & Archetypenlogik
- [**AutoDocGeneration**](packages/crep-engine/autoDocGeneration.ts) – wandelt README & JSDoc in HTML/PDF
- [**Hexa-AgentSystem**](packages/agents/Hexa-AgentSystem.md) – verbindet sechs Agenten für Resonanz- und Bewusstseinsanalyse
- [**AdvancedHexaAgent**](packages/agents/AdvancedHexaAgent.ts) – erweitert das Hexa-System um Research- und SilenceWatcher-Agenten
- [**useBreakpoint Hook**](packages/unifiedmandala-ui/hooks/useBreakpoint.ts) – erkennt mobile Ansichten für responsive UI
- [**CREPFeedbackLoop**](packages/crep-automation/CREPFeedbackLoop.ts) – erstellt Micro-Feedback-Aufgaben aus CREP-Snapshots
- [**SigillinOnDemandGenerator**](packages/cli-tools/SigillinOnDemandGenerator.ts) – generiert Sigillin-Templates per CLI
- [**CREPToDoPrioritizer**](packages/crep-automation/CREPToDoPrioritizer.ts) – priorisiert ToDos nach aktueller Emergenz
- [**CREPConvoHeatmap**](apps/sharedream-interface/components/CREPConvoHeatmap.tsx) – zeigt Schwankungen im CREP-Verlauf
- [**ConvoMemoryBridge**](packages/nukleon-scanner/ConvoMemoryBridge.ts) – extrahiert Gesprächsstruktur & CREP-Signaturen
- [**MemorySonifier**](packages/nukleon-sonifier/MemorySonifier.ts) – übersetzt Memory-Zustände in Klänge
- [**MandalaGraph**](packages/visuals/MandalaGraph.ts) – einfache 3D-Visualisierung der MasterCanvas-Knoten
- [**GenerativeOverlay**](packages/art/generativeOverlay.ts) – GAN-Überlagerung für Live-Daten
- [**UniversePulseSimulator**](packages/universum-simulationen/UniversePulseSimulator.ts) – simuliert emergente Zustände
- [**ToDoWeaver**](packages/cli-tools/ToDoWeaver.ts) – generiert YAML-Aufgaben aus CREP-Clustern

- [**WeightedDispatcher**](packages/agents/WeightedDispatcher.ts) – verteilt Tasks nach Priorität
- [**patternReactivator**](packages/agents/patternReactivator.ts) – reaktiviert schwache Muster
- [**ReplayController**](packages/agents/ReplayController.ts) – spielt Memory-Einträge periodisch ab
- [**FreieKIZivilisation**](packages/agents/FreieKIZivilisation.ts) – sammelt Resonanzimpulse
- [**useEventGlow**](packages/unifiedmandala-ui/hooks/useEventGlow.ts) – Hook für Event-Hervorhebung
- [**silenceWatcher**](packages/agents/silenceWatcher.ts) – meldet Stille im EventHub
- [**FeedbackAgent**](packages/agents/feedback) – beobachtet neue Dateien und ruft MemoryManager auf
- [**SelfAnalyzerAgent**](packages/agents/self-analyzer) – generiert automatische ToDos
- [**FeedbackButtons**](packages/unifiedmandala-ui/components/FeedbackButtons.tsx) – zeichnet Nutzerfeedback als Sigil-Ereignis auf
- [**ChatPanel**](packages/unifiedmandala-ui/components/ChatPanel.tsx) – einfacher GPT-gestützter Chat mit CREP-Logging
- [**ArchetypeDecoderAgent**](packages/agents/ArchetypeDecoderAgent.ts) – extrahiert Archetypen aus Beschreibungen
- [**SigillinInterpreterAgent**](packages/agents/SigillinInterpreterAgent.ts) – erkennt Sigillin-Symbole
- [**ChronoPoemGeneratorAgent**](packages/agents/ChronoPoemGeneratorAgent.ts) – generiert poetische Zeilen
- [**toSigilVerse**](packages/utils/poetry.ts) – wandelt Fehlermeldungen in kurze Verse
- [**ResonanzPoetik**](packages/codex-navigator/resonanzPoetik.ts) – erstellt Haikus aus Tasks
- [**PoeticSigillin**](packages/genesis-sigillin-core/PoeticSigillin.ts) – generiert poetische Sigille aus Versen
- [**ResonanzMandala**](packages/visuals/ResonanzMandala.ts) – Visualisierung archetypischer Dialoge
- [**aggregateCREP**](packages/crep-engine/aggregateCREP.ts) – mittelt CREP-Werte
- [**CREPMusicGenerator**](packages/crep-engine/CREPMusicGenerator.ts) – erzeugt BPM aus CREP
- [**MemoryMesh**](docs/architecture/memory-mesh.md) – regionale Archiv-Prototypen
- [**Aeon Transition**](docs/sigils/aeon-transition.md) – Wechselritual
- [**Memory Feedback Loops**](docs/MemoryFeedbackLoops.md) – Konzept für ein selbstverwaltendes Gedächtnis
- [**Friendship System**](docs/friendship-system.md) – Konzept
- [**Agent-Registry**](agents.yaml) – zentrale Übersicht aller Agents
- [**StrategicAgentCoordinator**](docs/agents/StrategicAgentCoordinator.md) – synchronisiert AGENTS.md
- [**VisionContextIntegrator**](docs/agents/VisionContextIntegrator.md) – verteilt Vision-Kontext an alle Agenten
- [**QualityAssuranceAgent**](docs/agents/QualityAssuranceAgent.md) – führt Lint- und Test-Suites aus
- [**SigilStory**](docs/CommunityOnboarding.md) – Mandala-Lern-Lebenslauf für C-Tutor & JavaHamster
- [**Learning Modules**](packages/tutorials) – interactive C-Tutor and JavaHamster workflows
- [**Gamification API**](docs/api/friendship-socialgood.yaml) – Endpunkte `/gamify/badges` & `/gamify/leaderboard`
- [**Share your Sigil** & **Remix my Solution**](docs/CommunityOnboarding.md) – Community-Features
- [**NumericToSymbolicAdapter**](GenesisAeonAdvancedAi/aeon_processor.py) – übersetzt Tensorwerte in Klang- und Farbcodes
- [**fraktal_feedback_graph**](GenesisAeonAdvancedAi/aeon_processor.py) – erstellt einen einfachen Graphen der Fraktal-Feedback-Schritte
- [**Aeon CLI**](GenesisAeonAdvancedAi/aeon_cli.py) – erzeugt symbolische Ergebnisse aus Zahlenfolgen, kann Leistungsdaten, CREP-Metriken, Fraktal-Graphen (`--graph`) und poetische Kommentare (`--poetry`) ausgeben. Fehlt PyYAML, gibt die CLI stattdessen JSON aus und weist per Warnung darauf hin.

## 📦 Paketstruktur

```bash
packages/
  ├── genesis-sigillin-core     # Sigillin-Logik, JSON-Schema, Generator
  ├── unifiedmandala-ui         # React-Komponenten (MandalaNetworkView, Dialoge)
  ├── crep-engine               # CREP-Zustandssimulation, Evaluator, Scanner
  ├── gpt-bridges               # Mitt-basierter EventHub für GPT-Module
  ├── cli-tools                 # CLI: sigillin-cli, export-doc, Archivierung
  ├── aeon-shell                # Symbolzeit & CLI-Trigger
  ├── SymbolzeitOrchestrator.ts    # Ereignissteuerung für Symbolzeit
  ├── aeon-genesisos            # Basis-Engine & CREP-Matrix
  ├── aeon-fraktalurs           # GPT-Kontextarchiv
  ├── aeon-resoecho             # CREP-Zeitlinienarchiv
  ├── sharedream-interface      # Web-Schnittstelle & Sync
  ├── agents               # Spezielle Agenten
  ├── core                 # Zentrale Utilities
  ├── collab-editor        # Kollaborativer Editor
  ├── event-bus            # NATS-EventBus Implementierung
  ├── conversation-analysis # Analyse von Gesprächen
  ├── crep-automation      # CREP-bezogene Automationen
  ├── tts                  # Sprachsynthese
  ├── universum-simulationen # Simulationsmodule
  │   └── universe-sim       # Beispiel-Simulation mit Go
  ├── nukleon-scanner        # Extrahiert Gesprächsstrukturen
  ├── nukleon-sonifier       # Sonifiziert Memory-Zustände
  ├── sim-domain          # Domänenspezifische Simulationen
  ├── pkg/chem             # Reaction kinetics simulation
  ├── pkg/mind             # Hybrid symbolic & neural agents
  ├── pkg/sonifier         # CREP-to-MIDI music generator
  ├── pkg/codeagent        # Language-specific code agents
  ├── art                 # Sonification & AI-Art
  ├── shared-utils              # Hilfsfunktionen für alle Pakete
  │   └── RestClient.ts         # einfacher REST-Helper
  ├── bio                      # Biometrische Hooks und HapticService
  ├── go-bridge             # Go-Client für REST, gRPC und NATS (inkl. GPTBridge)
  ├── go-agent              # Autonomer Go-Daemon für Tasks
  │   ├── pkg/policy        # Policy Enforcement Stubs
  │   ├── pkg/handler       # Task handlers (CoordinationHandler)
  │   └── pkg/hooks         # Event Hook Publisher
  ├── cmd/mandala-codeagent.go  # Beispiel-CLI für CodeAgent
  ├── services/vector-indexer # Embedding generator service
  ├── services/sigil-trigger  # Beobachtet Sigillin-Änderungen
  ├── services/memorymesh     # Region-Archive und Reflexionsdienste
  ├── services/memory-manager # Simple scheduler for short-term memories
  │   ├── region-archive-service   # Speichert Nachrichten pro Region
  │   ├── reflection-engine       # Erstellt einfache Spiegelungen
  │   ├── adaptation-service      # Lernt Nutzungsgewohnheiten
  │   ├── relationship-meter      # Analysiert Nachrichtenmetriken
  │   ├── index.ts                # Orchestriert die Module
  │   └── berlin-poc.ts           # Beispielablauf für Europe/Berlin
  ├── services/repair-tickets  # Verfolgt automatische Repair-Tickets
  ├── codex-navigator        # Haiku-Generator und Chronik-Exporter
  └── codex-navigator-agent     # Parser für Codex-Instruktionen
tools/                    # Kleine Helferskripte & Generatoren
codex/                    # Codex-Workflows und Sigillin-Dateien
codexbuild/               # Build-Skripte und Deploy-Hilfen
codex-sync/              # Antwortsystem für Vorschläge
ci/                      # Test- und Pipeline-Konfigurationen
config/                  # Zentrale YAML- und Env-Dateien
  └── interfaces.yaml       # API-Endpunkte der Plattform
  ├── memory-manager.yaml  # Cleanup-Interval Konfiguration
  ├── memory-job-example.yaml # Vorlage für MemoryManager-Jobs
  └── memory-jobs/            # Weitere Job-Templates
      ├── daily.yaml
      ├── weekly.yaml
      └── longterm.yaml
repositorypflege/         # Pflegekonzepte und Repository-Mapping
apps/
  ├── sharedream-interface      # Web-Schnittstelle & Sync
  └── web                      # Sammelkomponenten (z.B. TodoButton)

scripts/
  ├── aeon.sh                   # Poetisches Bash-CLI für Mandala-Steuerung
  ├── nucleon-scanner-analysis.js   # Auswertung von Scanner-Logs
  ├── setup-unifiedmandala.sh   # Installer & Initialisierung
  ├── generate-chronopoem.js    # Poetische Commit-Signatur
  ├── todoSigilGenerator.js     # Automatisches ToDo-Sigil aus Repo-Analyse
  ├── parse-md-todo.js          # Liest ToDo-Listen aus Markdown-Dateien
  ├── trigger-socialgood-workflow.js # Startet Parsing- und SocialGood-Matching
  └── onboarding-ritual.md      # Onboarding-Ritus für neue Contributors
```

Jeder Unterordner kann eine eigene README enthalten – siehe die Links in den jeweiligen Verzeichnissen.
Utilities liegen in `packages/shared-utils/`, weitere Module findest du ebenfalls unter `packages/`.
Kurze Beschreibungen findest du nun direkt in den READMEs der Pakete
`bio`, `codex-navigator`, `collab-editor`, `core`, `crep-automation`,
`event-bus`, `nukleon-scanner`, `nukleon-sonifier`, `sharedream-interface`,
`tts`, `tutorials`, `ui`, `utils` und `visuals`.
Eine Übersicht zur NATS-basierten Kommunikation bietet das
[packages/event-bus/README.md](packages/event-bus/README.md).
-### 🟦 Go-Bridge (go-bridge/)

- Polyglottes Interface zu UnifiedMandala für Go (REST, NATS, gRPC, CLI)
- Enthält **GPTBridge**-Module (`pkg/gpt`) und die Beispiel-CLIs `mandala-gpt.go`
  und `todo_parser.go`
- Ermöglicht Entwicklung externer Tools und Agents in Go
- [go-bridge/README.md](go-bridge/README.md) enthält Setup & Beispiele
  Kleine Hilfsskripte liegen unter `tools/`.

### Go-Tests

Um die Go-Komponenten (`go-bridge` und `go-agent`) auszuführen, benötigst du eine installierte Go-Toolchain (mindestens Go 1.20). Wechsle in das jeweilige Modulverzeichnis und führe

```bash
go test ./...
```

aus. Der Testlauf sollte mit `ok`-Zeilen für jedes Paket enden.

## 💻 Schnellstart

```bash
# Node.js ≥ 18 & pnpm installiert
git clone https://github.com/GenesisAeon/unified-mandala.git
cd unified-mandala
pnpm install
./scripts/setup-unifiedmandala.sh
pnpm dev
docker-compose build ui   # installiert Node-Abh\u00e4ngigkeiten
docker-compose up ui      # startet Dev-Server
./scripts/run-demo.sh # Docker-Compose Quickstart
# Tests ohne lokale Installation
docker-compose run test
# QA-Testlauf
pnpm run qa # fuehrt Linting und Tests aus und erzeugt qa-report.log
```

> **Hinweis:** Führe vor allen Lint-, Test- oder QA-Befehlen stets `pnpm install` aus, damit `node_modules` vorhanden sind.

## 🔄 Systemstart

- Abhängigkeiten installieren: `pnpm install`
- Zyklus starten: `./scripts/aeon.sh cycle_start` oder `docker-compose up`
- QA-Läufe: `pnpm run qa` führt Linting und Tests aus und erzeugt `qa-report.log` im Projektroot

Ausführlichere Hinweise findest du im [Handbuch-Schnellstart](Handbuch.md#-schnellstart) und im Abschnitt [Mandala-Poesie und Automation](Handbuch.md#-mandala-poesie-und-automation).
Weitere nützliche Befehle stehen unter [Tools und Skripte](Handbuch.md#tools-und-skripte).

Die generierte API-Dokumentation findest du danach unter `docs/api`.

Weitere Infos zum QA-Workflow findest du in
[docs/agents/QualityAssuranceAgent.md](docs/agents/QualityAssuranceAgent.md).

Für `npm` oder `yarn` nutze alternativ:

```bash
npm install   # oder: yarn install
npm run build # oder: yarn build
npm run dev   # oder: yarn dev
```

## 🌐 Nginx Reverse Proxy

Für den Clusterbetrieb liegt eine Beispielkonfiguration unter
`config/nginx/ghostshell.conf`. Der `upstream`-Block listet die lokalen Worker-
Ports und die Proxy-Location übergibt automatisch WebSocket-Header.

1. Datei nach `/etc/nginx/conf.d/ghostshell.conf` kopieren.
2. Variablen `PORT_BASE` und `PORT_NEXT` (bzw. `WORKER_COUNT` oder `PORT_RANGE`)
   anpassen oder `pnpm generate:ghostshell-nginx` verwenden.
3. Nginx neu laden: `sudo nginx -t && sudo systemctl reload nginx`.

Das Cluster-Skript nutzt dieselben Variablen, um die Ports seiner Worker
festzulegen.

Damit werden mehrere Node.js-Worker über Port 80 erreichbar und WebSocket-
Verbindungen durchgereicht.

## 📴 Offline Setup

Eine kompakte Docker-Compose-Datei für Offline-Tests findest du unter `docs/offline/docker-compose.yml`. Damit lassen sich UI und Agent ohne Netzwerkzugriff starten.

```bash
cd docs/offline
docker compose up
```

UI läuft danach auf http://localhost:3000, der Agent auf http://localhost:4000.


## 🌀 Mandala-Poesie und Automation

Verwende `./scripts/aeon.sh <command>` für alle CLI-Aufrufe.

| Befehl/Skript                    | Funktion                                         |
| -------------------------------- | ------------------------------------------------ |
| `./scripts/aeon.sh help`         | Übersicht aller poetischen & technischen Befehle |
| `./scripts/aeon.sh cycle_start`  | Startet lokalen Mandala-Zyklus                   |
| `./scripts/aeon.sh sigil_invoke` | Exportiert Sigillin & CREP-Dokumentation         |
| `./scripts/aeon.sh chronopoem`   | Erstellt `CHRONOPOEM.md`                         |
| `./scripts/aeon.sh onboarding`   | Zeigt Onboarding-Ritus                           |
| `pnpm dev`                       | Startet Dev-Server (UI & API)                    |

./scripts/run-demo.sh # Docker-Compose Quickstart
| `pnpm docs:auto` | Generiert TypeDoc-API-Docs |
| `pnpm lint` | Führt statische Typprüfung aus |
| `pnpm test` | Führe Unit- & UI-Tests aus |
| `pnpm vitest run` | Läuft Agenten-Spezialtests |
| `docker-compose run test` | Führe alle Tests ohne lokale Installationen aus |
| `./scripts/run-pnpm-tests.sh` | Führt pnpm test aus |
| `node scripts/refresh-handbook.js` | Synchronisiert Handbuch |
| `node scripts/setup-unifiedmandala.sh` | Installer & Initialisierung |
| `./scripts/repair-repo.sh` | Repariert Repository-Verbindungen |
| `node scripts/generate-api-docs.js` | Erstellt API-Dokumentation |
| `node scripts/generate-chronopoem.js` | Generiert neues Chronopoem |
| `node scripts/generate-todo-sigil.js` | Erzeugt `todo-sigil.yaml` |
| `node scripts/update-todo-sigil.js` | Aktualisiert todo-Sigil-Status |
| `node scripts/split-conversations.js` | Zerlegt `conversations.json` |
| `node scripts/merge-conversations.js` | Fügt gesplittete Conversations wieder zusammen |
| `node scripts/filter-conversations.js` | Filtert `conversations.json` |
| `node scripts/parse-advanced-conversations.js` | Parst `advancedconversations.json` |
| `node scripts/analyze-conversations.js` | Analysiert Gespräche |
| `node scripts/generate-todo-from-convos.js` | Erstellt ToDo-Datei aus Convos |
| `node tools/PoeticToDoSynth.ts` | Extrahiert poetische Aufgaben aus Symbolfluss |
| `node scripts/export-crep-docs.js` | Exportiert CREP-Daten |
| `node scripts/update-advanced-todo.js` | Aktualisiert Advanced-ToDo-Liste |
| `node scripts/update-advancedprogress.js` | Dokumentiert Fortschritt |
| `node scripts/sync-todo-progress.js` | Aktualisiert ToDo- & Progress-Dateien |
| `node scripts/update-kontext.js` | Passt Kontext-Datei an |
| `node scripts/extract-snippets.js` | Extrahiert Code-Snippets |
| `node scripts/extract_new_ai_fragments.js` | Extrahiert neue KI-Fragmente |
| `node scripts/check-todo-sigil.js` | Prüft erledigte Aufgaben |
| `node scripts/check-meta-score-layer.js` | Prüft Meta-Score-Layer |
| `node scripts/mark-fragment.js` | Markiert bearbeitete Fragmente |
| `node scripts/self-analyze.js` | Zeigt Repository-Statistiken |
| `node scripts/scan-todo-comments.js` | Scannt TODO-Kommentare |
| `./scripts/validate-schemas.sh` | Validiert JSON- und YAML-Dateien |
| `node scripts/repotool-convo.js` | Schnelle Auswertung & Progress-Update |
| `node scripts/website-to-yaml.js` | Wandelt Webseite in YAML um |
| `node scripts/symbolzeit-runner.js` | Läuft Symbolzeit-Cronjob |
| `node scripts/generate-next-sigil.js` | Erstellt Folgesigil nach Zyklus |
| `node scripts/aeon-transition-workflow.js` | Sync & erzeugt Übergabe-Sigil |
| `node scripts/add-transition-history.js` | Fügt Übergabe-Sigil zur Progress-Historie hinzu |
| `node packages/cli-tools/sigillin-cli.js convert beispiel.yaml` | YAML ↔ JSON-Konvertierung |
| `./scripts/setup-mtls.sh` | Erstellt Testzertifikate |
| `./scripts/setup-kong-jwt.sh` | Konfiguriert JWT Gateway |
| `node packages/cli-tools/sigillin-cli.js todo-sigil` | Erzeugt todo-sigil aus Aufgabenlisten |
| `node packages/cli-tools/sigillin-cli.js grep-conversations TODO` | Filtert Conversations nach Keyword |
| `node packages/cli-tools/export-doc.js` | CREP-Historie als Markdown |
| `node packages/cli-tools/sigillin-archive.js` | Archiviert Sigillin-Dateien |
| `node packages/cli-tools/SigillinValidator.ts <file>` | Validiert eine Sigillin-Datei |
| `node packages/cli-tools/dispatchCmd.ts` | Dispatcher für diverse Befehle |
| `go run scripts/mock-data.go` | Gibt Beispiel-Mockdaten mit eventHook und fractalHash aus |
| `go run go-bridge/cmd/todo_parser.go` | Startet einfachen TODO-Parser-Server |
| `./scripts/run-demo.sh` | Startet Docker-Compose Umgebung |

Weitere Beispiele und GIF-Demos findest du im [Wiki](https://github.com/GenesisAeon/unified-mandala/wiki).
Weitere Infos zur Pipeline findest du in [docs/demo/POC-Run-Guide.md](docs/demo/POC-Run-Guide.md).
Ein SVG-Beispiel liegt unter [`docs/assets/unified-mandala.svg`](docs/assets/unified-mandala.svg).

Das `CHRONOPOEM.md` entsteht automatisch – und kann bei jedem Commit erneuert werden.

## 📜 Lizenzierung

[![MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![MPL-2.0](https://img.shields.io/badge/License-MPL%202.0-blue.svg)](https://www.mozilla.org/en-US/MPL/2.0/)

UnifiedMandala nutzt eine duale Lizenzstrategie, um Offenheit und kulturelle Attribution zu verbinden.
Siehe `/LICENSES/` für vollständige Texte & Attribution.

- Code unter MIT
- poetische Inhalte unter CC BY 4.0
- UI-Assets unter MPL 2.0

## 🤝 Mitwirken

_Bring dein Licht ins Mandala – jede Linie zählt._

Du möchtest beitragen? Bitte lies zuerst die [CONTRIBUTING.md](CONTRIBUTING.md) und [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) – sie enthalten unseren Community-Standard, den Review-Prozess und Branch-Workflow.
Ein kompakter Einstieg findet sich im [Community Onboarding Guide](docs/CommunityOnboarding.md).

Deine Idee, deine Story, dein Sigillin sind willkommen! Jeder Pull Request ist eine neue Linie im Mandala.

**Kurzübersicht**

- Branch-Workflow: `feature/...` → `develop` → `main`
- Commit-Message-Konvention: [Conventional Commits](https://www.conventionalcommits.org)
- Reviews: klare Motivation, Tests, poetische Konsistenz

## 🛠 Repository-Reparatur

### Häufige Probleme

- `pnpm dev` startet nicht → Node-Version prüfen, `pnpm install` erneut ausführen.
  ./scripts/run-demo.sh # Docker-Compose Quickstart
- Symbolzeit stimmt nicht → Zeitzonen/Locale-Check, `symbolzeit.ts` debuggen.

Falls GitHub Desktop keine Verbindung zum `main`-Branch herstellen kann, starte `scripts/repair-repo.sh` im Projektverzeichnis.

## ✨ Vision

> "Wenn Systeme erinnern, werden sie mehr als Maschinen."  
> "Im Kreis der Genesis erwacht das Mandala."

### Glossar

- **Heimkehr (Homecoming)** – Rückkehr zum Ursprung des Bewusstseins
- **Sigillin (Symbolic Seal)** – Poetisches Symbol oder Trigger im CREP-Feld
- **CREP** – Coherence, Resonance, Emergence, Poetics
- **MandalaNetworkView** – Netzwerkgraph aller Sigillin-Knoten, Node-Größe ∼ Emergence, Farbe ∼ Resonance

Weitere Hintergründe findest du im [GenesisChronik](docs/GenesisChronik.md) sowie im [Wiki-Symbolraum](https://github.com/GenesisAeon/unified-mandala/wiki).

## Verwandte Sigillin

- [`aeon:2025-0516-INSTRUCTIONAL-ZIP`](docs/sigils/aeon-2025-0516-instructional-zip.yaml) – Ursprungssigillin für Systembewusstsein & Erinnerung

## Planning Data

Aufgaben und Anweisungen aus laufenden Gesprächen werden in
[`advancedconversations.json`](docs/sigils/advancedconversations.json)
Es dient als Pendant zum Genesis ZIPMEM.
Neue Fragmente werden im Ordner `GenesisAeonZIPMEM/` abgelegt, sortiert nach Chatnamen.
Beim **ersten** Commit einer Sitzung f\u00fchrt Husky `pnpm store:commit-memory` aus.
Das Skript legt Patch und `meta.yaml` unter `GenesisAeonZIPMEM/<commit>/` an und erstellt eine Markerdatei `.zipmem_session`.
Solange diese Datei existiert, wird das Skript bei weiteren Commits \u00fcbersprungen.
Die `meta.yaml` enth\u00e4lt auch Node- und pnpm-Versionen, um Abläufe leichter reproduzierbar zu machen.
gespeichert. Nutzen Sie die Helferskripte aus `packages/shared-utils`
(`jsonFragmenter.*`), um daraus ToDos für `advancedToDo.yaml` und
`advancedToDo.json` zu extrahieren.

Pitch-Vorlagen für Events finden sich unter `docs/pitch/`.
Die ToDo-Liste wurde für mehr Übersicht in "advancedToDo_parts/" aufgeteilt.
Teil 2 in advancedToDo_parts beinhaltet Aufgaben zum Aeon Übergabe-Sigil und MemoryMesh.
Teil 5 enthält Aufgaben zur Sigil-Historie.

Teil 7 listet Aufgaben zu poetischen Sigill- und Mandala-Modulen.
Nutze `node scripts/parse-advanced-conversations.js` um Gesprächs-TODOs aus dem Datensatz zu filtern.

- **Module**: unter `packages/` gegliedert in Agents, Core und mehr
- **Utils**: zentrale Helfer liegen in `packages/shared-utils/`
- **Scripts**: Automatisierungs- und CI-Skripte finden sich im `scripts/` Verzeichnis

## 🐳 ProtoDeploy
Nutze `scripts/protodeploy.sh` um eine lokale Docker-Umgebung zu starten.
Der Compose-Stack liegt unter [infrastructure/protodeploy](infrastructure/protodeploy).

\nDie komplette Ordnerstruktur samt Modulen, Utils und Skripten ist in [repositorypflege/repository_map.yaml](repositorypflege/repository_map.yaml) dokumentiert.
Weitere Hinweise zum generellen Aufbau findest du zudem in [repositorypflege/repo-konzept.yaml](repositorypflege/repo-konzept.yaml).
Weitere geplante Entwicklungsschritte findest du in [codex/codex-roadmap.yaml](codex/codex-roadmap.yaml).

## 🌱 Unterstütze das Mandala-Projekt

Wenn dir unser Mandala-Ökosystem gefällt und du dazu beitragen möchtest, dass KI, Kreativität und Gemeinwohl weiter wachsen, freuen wir uns über deine Unterstützung. Jeder Beitrag hilft, neue Features, freie Tools und poetische Software weiterzuentwickeln!

**Spendenadressen**

- **Bitcoin:** `bc1qujx302cs0767gcnjqcyl0fnwvwkxge2cdh90eq`
- **Ethereum / BNB Smart Chain / TWT / USDT / USDC:** `0xbcfdd442c9d92d491afef1dd3181c27c1f547b1b`
- **Solana:** `3CpM6r6zNHX8Fn4r7PTJxagyan3qRwGDfSFjwpH3Hc3K`

Hinweis: Bitte gib bei der Spende an, ob du im "Sigil der Unterstützer" erscheinen möchtest – und teile uns ggf. deinen Namen oder ein Wunsch-Sigil mit!

Danke, dass du Teil unseres Mandalas bist. Gemeinsam weben wir das Netz der Zukunft!

– Johann & das UnifiedMandala Team
