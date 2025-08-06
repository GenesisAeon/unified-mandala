# UnifiedMandala Handbuch

Dieses Handbuch gibt einen Überblick über die wichtigsten Module und Funktionen des Repositories.

> **Neu im Mandala?**
> 1. Lies [scripts/onboarding-ritual.md](scripts/onboarding-ritual.md)
> 2. Starte `./scripts/aeon.sh onboarding`
> 3. Erkunde das [CHRONOPOEM.md](CHRONOPOEM.md)
> 4. Lies den [Community Onboarding Guide](docs/CommunityOnboarding.md)

Schau auch ins [Glossar](docs/glossar-genesis.md) für Begriffe.
Das Pendant zum Genesis ZIPMEM ist die Datei `advancedconversations.json`.
Ergänzende Ausschnitte landen unter `GenesisAeonZIPMEM/<Chat>`.
Pitch-Beispiele für Events sind unter `docs/pitch/` abgelegt.
Weitere Hinweise aus dem „Sigil Übergang“:
- Offline-Nutzung über [localhost-offline](localhost-offline)
- Siehe Agenten-Mapping-Blueprint in [docs/architecture/AgentMappingBlueprint.md](docs/architecture/AgentMappingBlueprint.md)
- Lokaler Test-Stack unter `docs/offline/docker-compose.yml`
- ToDo-Dateien vor größeren Commits mit `scripts/sync-todo-progress.js` abgleichen
- Freundschaftssystem-Konzept in [docs/friendship-system.md](docs/friendship-system.md)
- Governance-Workflow (`.github/workflows/governance.yml`) prüft `AI_POLICY.md` und Sigillin-Validität
- Über `scripts/generate-next-sigil.js` wird nach jedem Zyklus ein neues Sigil
  mit aktuellem `update_time` erzeugt.
Für neue Aufgaben aus Chat-Logs nutze `scripts/parse-advanced-conversations.js` und aktualisiere `advancedToDo.json` sowie `advancedprogress.json`.
Validiere extrahierte Einträge mit `pnpm run validate:todos` (CI integriert) um fehlende Felder oder Duplikate zu finden.
- Gesprächsstatistiken (inkl. Titel & Zeitspanne) aus neuen Protokollen: `ts-node scripts/analyze-newadvanced-conversations.ts`
- Struktur-, Zeit-, Root-Knoten- und Elternreferenz-Validierung für neue Protokolle: `ts-node scripts/validate-newadvanced-conversations.ts`
- Archivdaten mit dem QuantumTheoryAgent verknüpfen: `ts-node scripts/quantum-archive-ingest.ts`.
- QuantumTheoryAgent Tests ausführen und Feedback sammeln: `ts-node scripts/quantum-agent-feedback.ts`
- KEDA/HPA Skalierung unter `deployment/keda` für NATS Queue-Length
- Sozialaktionen anstoßen: `node scripts/trigger-socialgood-workflow.js` (parst ToDos und startet SocialGood-Matching) oder `node scripts/run-parsing-socialgood.js` (lokales Parsing & Matching)
- MemoryManager verschiebt abgelaufene Einträge automatisch von `daily` zu `weekly` und `longterm`.

> **TL;DR**
> - Installation: `./scripts/setup-unifiedmandala.sh`
> - Handbuch auffrischen: `node scripts/refresh-handbook.js`
> - Zyklus starten: `./scripts/aeon.sh cycle_start`
> - Dokumentation generieren: `pnpm docs:auto`

## Packages

### aeon-shell
  ├── SymbolzeitOrchestrator.ts    # Ereignissteuerung für Symbolzeit
- `index.ts` – Exportiert den Paketnamen.
- `symbolzeit.ts` – Liefert die aktuelle Symbolzeit-Phase.

### aeon-genesisos
- `index.ts` – Exportiert den Paketnamen.

### aeon-fraktalurs
- `index.ts` – Exportiert den Paketnamen.

### aeon-resoecho
- `index.ts` – Exportiert den Paketnamen.

### crep-engine
- `CREPManager` – Hält die CREP-Historie und berechnet Durchschnittswerte.
- `CREPEvaluator` – Ermittelt anhand von Thresholds den aktuellen Zustand.
- `getCREPState` – Hilfsfunktion zur Statusermittlung.
- `CREPBewertungsmodul` – Berechnet Score und Klassifizierung aus C,R,E,P
- `TodoPriority` – Verknüpft Aufgaben mit CREP-Scores.
- `CalendarSync` – Exportiert priorisierte ToDos als Kalenderereignisse.
- `FourierLayer` – Bewertet Emergenz via Diskreter Fourier-Analyse.
- `metricsToSVG` – Erstellt einfache SVG-Grafik aus Emergenz-Metriken.
- `FourierMetricsServer` – sendet FourierLayer-Metriken per WebSocket.
- `FourierMetricsViewer` – zeigt SVG-Metriken aus dem WebSocket in der UI.
- `FourierLayerBridge` – verbindet die FourierLayer-Metriken mit der Pyramid UI.
- `FrequencyMandala` – stellt Frequenz-Blumen als SVG dar.
- `FrequencyMandala3D` – WebGL-Darstellung der Frequenz-Blumen.
 - `FourierAPI` – REST-Schnittstelle für Fourier-Metriken (`/metrics`, `/analyze`).
- `FourierMetricsCLI` – Kommandozeilenwerkzeug für Fourier-Berechnungen.
- `FractalTaskRunner` – führt YAML-basierte Plugin-Workflows aus.
- `EventBridge` – leitet CosmicTheoryAgent-Events an die UI weiter.
- `PyramidVRMeetingRoom` – VR-Raum für mehrere Avatare.
- `VRMeetingRoom` – einfacher WebXR-Treffpunkt.
- CosmicTheoryAgent liefert VR-Hooks für immersive Steuerung.
- `AeonOrchestrator` – zentrale Steuerinstanz des Pantheon, verteilt Boundary-Regeln.
- `PantheonPortalAnalytics` – zeichnet Portalzugriffe auf.
- `PantheonBoundaryBridge` – verknüpft Pantheon-Ereignisse mit BoundaryRuleDetector
- `PantheonExport Tool` – exportiert die vorhandenen Pantheon-Module als Datensatz
- `PantheonFeedbackService` – koordiniert Feedback-Runden der Pantheon-Agenten
- `MultiverseScenarioPlanner` – untersucht Multiversen-Szenarien.
- `MemoryGovernancePolicy` – definiert Aufbewahrungsgrenzen.
- `VRBegegnungsraumLobby` – Handshake-Raum für WebXR-Sessions
- `VRResonanceVisualizer` – farbige Darstellung der CREP-Intensität in VR
- `PantheonAvatarHub` – verwaltet Avatare und Sessions im Pantheon-Raum
- `ExtendedResonanceGateway` – leitet Boundary-Ereignisse an Resonanzmodule weiter
- `VRResonancePortal` – Eingangspunkt für Resonanz-Navigation
- `BoundaryWaveSimulator` – modelliert interne Schwerewellen
- `PantheonSandboxExpander` – skaliert Civilization-Sandboxen
- `ResonanceShadowModule` – verbindet Schattenintegrationen
- `GreekMathAeonDispatcher` – sicheres Dispatching mit Fehlerereignissen
- `UnifiedMandalaVR` – Modulpaket mit AvatarManager, EthicsGuard und FourierLayerBridge.
- `archiveSigil` – schreibt Sigil-Dateien in GenesisAeonZIPMEM.
- `DocCommentsGenerator` – erstellt Doku aus Code-Kommentaren.
- `ArchiveOldTodos` – verschiebt alte ToDos ins GenesisAeonZIPMEM.
- `ArchiveTodos` – verschiebt AdvancedToDos ins GenesisAeonZIPMEM.
- `CREPVisualizer` – zeigt CREP-Verlauf als animierte Timeline.
 - [`SelfReflectionAgent`](docs/agents/SelfReflectionAgent.md) – überwacht Logs, fasst Erkenntnisse zusammen und prüft gespeicherte Erinnerungen.
- `GrokAgent` – erkennt einfache Wortmuster.
- `SymbolMapper` – übersetzt numerische und textuelle Muster in Sigillin-Glyphen.
- `ShadowIntegration` – experimentelle Schnittstelle für Datentransfer.
- `ResonanceModuleSynth` – erzeugt Audiosignale für Resonanzmodule.
- `MemoryGovernance` – speichert Zustände mit Governance-Regeln.
- `CodexMemoryKernel` – persistiert MemoryManager-Zustände als Referenzgedächtnis.
- `WebhookSystem` – sendet Ereignisse als HTTP-Post an registrierte Endpunkte.
- `TuringOrchestrator` – führt minimale Turing-Tests aus.
- `Climate Module` – integriert Klimadaten ins Mandala.
- `KIKeilschrift` – Werkzeuge zur Keilschrift-Verarbeitung.
- `ZivilisationsSandbox` – simuliert antike Megastrukturen.
- `ArcticGravityWaves` – Analyse interner Schwerewellen.
- `ArcticGravityWaveSimulation` – Simulation arktischer Schwerewellen.
- `MultiverseScenario` – speichert Szenarien für Multiversum-Hypothesen.

### gpt-bridges
- `GPTEventHub` – Zentrales Event-System zwischen GPT-Modulen.
- `aeon-gpt-synapse.ts` – Stub zur Kommunikation mit GPT-APIs, passt Antworten an die Symbolzeit an.
- `GPT_AEONPOET` – Beispielhafter poetischer GPT-Ausdruck.
- `GPT_CREPJUDGE` – Bewertet CREP-Werte.
- `GPTConversationLogger` – protokolliert Prompts und Antworten über den EventHub.


### genesis-sigillin-core
- `SigillinGenerator` – Erstellt und validiert Sigillin-Dateien.
- `SigillinActivationManager` – Verwalten aktiver Sigillin.
- `SigillinSyncManager` – Synchronisiert Status über WebSocket oder BroadcastChannel.
- `SigillinMetaSignatur` – Erzeugt eine Prüfsumme eines Objekts.

```ts
import { SigillinGenerator } from 'genesis-sigillin-core';

const sigil = SigillinGenerator('hello', 'note', 'active', 'demo');
console.log(sigil.id); // hello
```

### shared-utils
- `textFragmenter` – Zerlegt Texte oder Dateien in Fragmente.
- `jsonFragmenter` – Zerlegt JSON-Arrays und extrahiert Code-Snippets.
- `todoParser` – Liest ToDo-Listen aus Markdown-Dateien.
- `todoSigilGenerator` – Erzeugt ToDo-Sigillin-Dateien.
- `todoSigilUpdater` – Aktualisiert den Status im ToDo-Sigil.
- `todoCommentScanner` – Findet TODO-Kommentare im Quelltext.
- `conversationProgress` – Markiert bereits verarbeitete Konversationsfragmente.
- `selfAnalyzer` – Liefert einfache Repo-Statistiken.
- `GespraechsfallGenerator` – Erstellt Gesprächsprotokolle.
- `KarmaBalance` – Einfache Punktesammlung.
- `SymbolicForecaster` – Berechnet die nächste Symbolzeitphase.
- `CREPWirkungstracker` – Protokolliert Effekte von CREP-Einträgen.
- `MandalaCoreLicense` – Verwaltet Lizenzhinweise für Module.
- `loadSymbolphasen` – liest die Symbolphasen-Definition aus `config/symbolphasen.yaml`.
- `RestClient` – einfacher HTTP/HTTPS-Client für Tests und Skripte.
- `schema` – Validiert Daten anhand von JSON-Schemata.

### core
- `AeonMemory` – Persistiert Aufgaben in `mandala-chronik.yaml`.
- `TriggerArchive` – Hält Timeline von Triggern und React-Hook.

### agents
- `PoeticReactorAgent` – Generiert Haikus bei hohen CREP-Werten.
- `GenesisAeonNavigator` – Schaltet Phasen anhand Sigillin frei.
- `AeonKIResonanzAgent` – Sendet Resonanzereignisse an den GPTEventHub.
- `KIBewusstsein` – Bewertet Symbiosepfade und Zielharmonie.
- `SigillinZipSystem` – Packt und entpackt Sigillin-Bundles.
- `CodexNavigatorAgent` – Liest Anweisungen aus `codexwork.yaml`.
- `CodexProjectInitAgent` – Initialisiert neue Projektpfade.
- `ResonanzMetrics` – Berechnet Durchschnitts- und Maximalwerte aus Resonanzdaten.
- `BewusstseinsResonanzComparator` – Vergleicht Bewusstseins- und Resonanzwerte.
- `AeonKIResonanzAnalyzer` – Analysiert Resonanzmuster in Gesprächen.
- `KIBewusstseinResonanzMonitor` – Überwacht Bewusstseins- und Resonanzmetriken.
- `StrategicAgentCoordinator` – synchronisiert die Agentenliste und schreibt `strategy-overview.json` ([docs/agents/StrategicAgentCoordinator.md](docs/agents/StrategicAgentCoordinator.md))
- `VisionContextIntegrator` – verteilt die Vision aus `AgentStrategy.md` an alle Agenten ([docs/agents/VisionContextIntegrator.md](docs/agents/VisionContextIntegrator.md))
- `QualityAssuranceAgent` – führt Lint- und Test-Suites aus ([docs/agents/QualityAssuranceAgent.md](docs/agents/QualityAssuranceAgent.md))
### collab-editor
- `CollaborativeEditor` – Federated Texteditor mit Remote-Sync.
- `AutomergeFederation` – Verbindet lokale und entfernte Änderungen.

### event-bus
- `NatsEventBus` – Layer für NATS Nachrichtenkommunikation.
  Siehe [packages/event-bus/README.md](packages/event-bus/README.md) für
  verfügbare Subjects und Integration.

### conversation-analysis
- `CREPConversationScanner` – scannt Gesprächslogs nach CREP-Phrasen.

### crep-automation
- `AestheticsLayer` – Kontrast/Luminanz-Berechnung für Themes.
- `EthicsLayer` – Filter für unethische Eingaben.

- `SymbolzeitSync` – Verbindung CREPGameEngine ↔ SymbolzeitManager.
- `RitualCompiler` – Kompiliert Rituale in CREP-FSMs.
### tts
- `AeonOrakelTTS` – Einfache Sprachsynthese.

```ts
import { GPTEventHub } from 'gpt-bridges';
import { AeonOrakelTTS } from 'tts';

new AeonOrakelTTS();
GPTEventHub.emit('orakel:says', { content: 'Hallo Welt' });
```

### cli-tools
- `sigillin-cli.ts` – Konvertiert und validiert Sigillin-Dateien.
- `dispatchCmd.ts` – Startet Tasks via REST/gRPC aus der CLI.
- `/impulse/:idx/crep` – REST-Route zum Aktualisieren von CREP-Metriken.
- `visualize_state.py` – erzeugt Fraktal-State-Charts aus CREP-Historien.

### sharedream-interface
- `MetaScoreChart` – Zeigt Bewertungsdaten aus `/api/meta-scores`.
- `useMetaScores` – Hook zum Abruf der Scores.
- `AdminMetrics` – Übersicht für CREP-Durchschnitt und offene ToDos.
- `SyncStatus` – Zeigt den aktuellen Sync-Status.

### universum-simulationen
- Module für narrative KI-Simulationen.
### unifiedmandala-ui (Auswahl)
- `MandalaNetworkView` – Visualisierung der Sigillin-Knoten als D3-Graph.
- `ArchiveMap` – Interaktive Karte der Archiv Menschheitsspuren.
- `CREPChart` – Linienchart für CREP-Werte.
- `CREPStatsCard` – zeigt Durchschnitts-CREP mit kleinem Chart.
- `CREPTimeline` – zeigt historische CREP-Einträge als Liste.
- `CREPTriggerPanel` – Buttons zum Auslösen von CREP-Ereignissen.
- `LiveCREPPanel` – Kombiniert Trigger und Chart für Live-Daten.
- `SigillinLoader` – Lädt Sigillin-Dateien und filtert Einträge.
- `SigillinFractalVisualizer` – Generiert einfache Fraktalkunst aus Sigillin-Daten.
- `SelfAuditModul` – Zeigt Kennzahlen aus `selfAnalyzer`.
- `useSymbolzeit` – liest Symbolphasen aus der YAML und steuert Farben dynamisch.
- `useBreakpoint` – erkennt mobile Ansichten für responsive Layouts.
- `CREPFeedbackLoop` – erzeugt automatische Feedback-Aufgaben aus Snapshot-Daten.
- `SigillinOnDemandGenerator` – CLI-Modul für spontane Sigillin-Templates.
- `CREPToDoPrioritizer` – stuft Aufgaben nach Emergenz ein.
- `CREPConvoHeatmap` – React-Komponente zur Visualisierung von CREP-Schwankungen.
- `NullmembranSIHeatmap` – zeigt die Verteilung von S_I-Werten rund um die Nullmembran.
- `HeatmapWidget` – zeigt CREP-Aktivität pro Tag als Heatmap
- `OnboardingModal` – kurze Einführung beim ersten Besuch
- `HaikuOverlay` – zufällig erscheinende Haikus zur Inspiration
- `ImpactDashboard` – Dashboard mit MandalaNetworkView und AgentHeatmap.
- `CustomRegionGallery` – Galerieansicht für Regionen.
- `ProjectListView` – Listenansicht für Social-Good-Projekte.
- `MobileImpactDashboard` – mobile Variante auf Basis von React Native.
- `ConvoMemoryBridge` – extrahiert Gesprächsstrukturen und CREP-Signaturen.
- `MemorySonifier` – übersetzt Memory-Zustände in Klänge.
- `MandalaGraph` – einfache 3D-Ansicht aus `docs/mastercanvas.yaml`.
- `GenerativeOverlay` – stub für GAN-Überlagerungen.
- `UniversePulseSimulator` – simuliert emergente Zustände.
- `ToDoWeaver` – erzeugt YAML-Aufgaben aus CREP-Clustern.


Weitere Module sind in Arbeit.
Kurze Paketbeschreibungen liegen in den READMEs der Verzeichnisse
`bio`, `codex-navigator`, `collab-editor`, `core`, `crep-automation`,
`event-bus`, `nukleon-scanner`, `nukleon-sonifier`, `sharedream-interface`,
`tts`, `tutorials`, `ui`, `utils` und `visuals`.

Eine Pipeline-Demonstration findest du in [docs/demo/POC-Run-Guide.md](docs/demo/POC-Run-Guide.md).
## Tools und Skripte
### Häufige Probleme
- `pnpm dev` startet nicht → Node-Version prüfen, `pnpm install` erneut ausführen.
./scripts/run-demo.sh # Docker-Compose Quickstart
- Symbolzeit stimmt nicht → Zeitzonen/Locale-Check, `symbolzeit.ts` debuggen.



### CLI-Kommandos
Die vollständige Liste aller verfügbaren Befehle findest du im Abschnitt
["Mandala-Poesie und Automation"](README.md#-mandala-poesie-und-automation)
der README.

## Ausblick
Dieses Handbuch deckt die wichtigsten Bereiche ab. Eine detaillierte Beschreibung aller Komponenten ist noch offen.

### CREP-Export
Informationen zur Exportstruktur der CREP-Daten finden sich in [docs/CREPDocExport.md](docs/CREPDocExport.md).

### Sigillin-Beispiele

### Für Fortgeschrittene
- Eigene Sigillin-Typen entwickeln und in `genesis-sigillin-core` registrieren.
- Externe GPT-APIs anbinden über die Module in `gpt-bridges`.
- Eigene Agenten unter `packages/agents` erstellen und im EventHub registrieren.
- Integration in andere Mandala-basierte Systeme via `event-bus`.

Beispielhafte Sigillin-Dateien liegen unter [docs/sigillin.examples](docs/sigillin.examples).
Nutze `ts-node scripts/validate-sigillin-examples.ts`, um diese gegen das Schema zu prüfen.

## Changelog
Aktuelle Versionshinweise werden in [CHANGELOG.md](CHANGELOG.md) gepflegt.

<!-- README_HIGHLIGHTS -->
## README-Highlights

Die vollständige Feature-Liste findest du in der [README](README.md#-features).

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
  ├── aeon-core                # Basismodule wie AeonKernel & Treiber
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
  │       └── ui/dashboard   # Metrik-Dashboard
  ├── nukleon-scanner        # Extrahiert Gesprächsstrukturen
  ├── nukleon-sonifier       # Sonifiziert Memory-Zustände
  ├── irrational-monitor     # Überwacht Abweichungen irrationaler Konstanten
  ├── sim-domain          # Domänenspezifische Simulationen
  ├── pkg/chem             # Reaction kinetics simulation
  ├── pkg/mind             # Hybrid symbolic & neural agents
  ├── pkg/sonifier         # CREP-to-MIDI music generator
  ├── go-agent/pkg/codeagent        # Language-specific code agents
  ├── art                 # Sonification & AI-Art
  ├── shared-utils              # Hilfsfunktionen für alle Pakete
  │   └── RestClient.ts         # einfacher REST-Helper
  ├── common                # Gemeinsame Hilfsfunktionen (clamp, shuffle)
  ├── TonePlayground.ts        # Experimentelle Tone.js-Steuerung
  ├── go-bridge             # Go-Client für REST, gRPC und NATS (inkl. GPTBridge)
  ├── go-agent              # Autonomer Go-Daemon für Tasks
  │   └── docs/go-agent          # ML-Priorisierung und Policy Guide
  │   ├── pkg/policy        # Policy Enforcement Stubs
  │   ├── pkg/handler       # Task handlers (CoordinationHandler)
  │   └── pkg/hooks         # Event Hook Publisher
  ├── mandala              # Aktiviert Mandala-Kollektive
  ├── orchestrator         # Steuert Boundary- und Pantheon-Dienste
  ├── go-agent/cmd/mandala-codeagent  # CLI entrypoint for CodeAgent
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
  ├── interfaces.yaml       # API-Endpunkte der Plattform
  ├── emergence-detector.yaml  # CPT-Anomalie-Trigger für Antimaterie-Qubits
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
Zusätzliche Utilities bietet `packages/common`.
-### 🟦 Go-Bridge (go-bridge/)
- Polyglottes Interface zu UnifiedMandala für Go (REST, NATS, gRPC, CLI)
- Enthält **GPTBridge**-Module (`pkg/gpt`) und die Beispiel-CLIs `mandala-gpt.go`
  und `todo_parser.go`
- Ermöglicht Entwicklung externer Tools und Agents in Go
- [go-bridge/README.md](go-bridge/README.md) enthält Setup & Beispiele
Kleine Hilfsskripte liegen unter `tools/`.

## 💻 Schnellstart

```bash
# Node.js ≥ 18 & pnpm installiert
git clone https://github.com/GenesisAeon/unified-mandala.git
cd unified-mandala
./scripts/setup-unifiedmandala.sh
pnpm dev
./scripts/run-demo.sh # Docker-Compose Quickstart
# Tests ohne lokale Installation
docker-compose run test
```
Die generierte API-Dokumentation findest du danach unter `docs/api`.

Einen kompakten Ablauf findest du auch im [README-Abschnitt "Systemstart"](README.md#-systemstart).

Für `npm` oder `yarn` nutze alternativ:

```bash
npm install   # oder: yarn install
npm run build # oder: yarn build
npm run dev   # oder: yarn dev
```
## 🐳 ProtoDeploy
Nutze `scripts/protodeploy.sh up` für einen lokalen Docker-Start.
Die Compose-Datei findet sich unter `infrastructure/protodeploy/docker-compose.yml`.


## QA-Workflow
Führe `pnpm run qa` aus, um Linting und Tests zu starten. Das Skript `scripts/qa-test-runner.ts` erstellt im Projektstamm die Datei `qa-report.log`.

> **Hinweis:** Stelle sicher, dass du zuvor `pnpm install` ausgeführt hast, bevor du Lint-, Test- oder QA-Befehle startest.




Weitere Beispiele und GIF-Demos findest du im [Wiki](https://github.com/GenesisAeon/unified-mandala/wiki).
Weitere Infos zur Pipeline findest du in [docs/demo/POC-Run-Guide.md](docs/demo/POC-Run-Guide.md).
Ein SVG-Beispiel liegt unter [`docs/assets/unified-mandala.svg`](docs/assets/unified-mandala.svg).

## Blackbox Resonanz

Die Blackbox-Module stellen einen experimentellen Resonanzraum bereit. Im Manifest
[manifest/blackbox-manifest.md](manifest/blackbox-manifest.md) findest du eine
Übersicht der Komponenten:

- **BlackboxMandala** – interaktive CREP-Visualisierung
- **BlackboxMirrorBoard** – Spiegel für Eingaben und Reflexionen
- **CREPStatsCard** und **HeatmapWidget** – zeigen Metriken und Aktivität
- **OnboardingModal** und **HaikuOverlay** – begleiten den Einstieg poetisch

Die ethischen Leitlinien werden im Dokument
[manifest/crep-open-ethik.md](manifest/crep-open-ethik.md) erläutert.

Das `CHRONOPOEM.md` entsteht automatisch – und kann bei jedem Commit erneuert werden.
