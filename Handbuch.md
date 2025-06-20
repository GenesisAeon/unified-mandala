# UnifiedMandala Handbuch

Dieses Handbuch gibt einen Überblick über die wichtigsten Module und Funktionen des Repositories.

> **Neu im Mandala?**
> 1. Lies [scripts/onboarding-ritual.md](scripts/onboarding-ritual.md)
> 2. Starte `./scripts/aeon.sh onboarding`
> 3. Erkunde das [CHRONOPOEM.md](CHRONOPOEM.md)

Schau auch ins [Glossar](docs/glossar-genesis.md) für Begriffe.

> **TL;DR**
> - Installation: `./scripts/setup-unifiedmandala.sh`
> - Handbuch auffrischen: `node scripts/refresh-handbook.js`
> - Zyklus starten: `./scripts/aeon.sh cycle_start`
> - Dokumentation generieren: `pnpm docs:auto`

## Packages

### aeon-shell
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

### core
- `AeonMemory` – Persistiert Aufgaben in `mandala-chronik.yaml`.
- `TriggerArchive` – Hält Timeline von Triggern und React-Hook.

### agents
- `PoeticReactorAgent` – Generiert Haikus bei hohen CREP-Werten.
- `GenesisAeonNavigator` – Schaltet Phasen anhand Sigillin frei.

### collab-editor
- `CollaborativeEditor` – Federated Texteditor mit Remote-Sync.
- `AutomergeFederation` – Verbindet lokale und entfernte Änderungen.

### event-bus
- `NatsEventBus` – Layer für NATS Nachrichtenkommunikation.

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

### sharedream-interface
- `MetaScoreChart` – Zeigt Bewertungsdaten aus `/api/meta-scores`.
- `useMetaScores` – Hook zum Abruf der Scores.

### universum-simulationen
- Module für narrative KI-Simulationen.
### unifiedmandala-ui (Auswahl)
- `MandalaNetworkView` – Visualisierung der Sigillin-Knoten als D3-Graph.
- `CREPChart` – Linienchart für CREP-Werte.
- `CREPTriggerPanel` – Buttons zum Auslösen von CREP-Ereignissen.
- `LiveCREPPanel` – Kombiniert Trigger und Chart für Live-Daten.
- `SigillinLoader` – Lädt Sigillin-Dateien und filtert Einträge.
- `SelfAuditModul` – Zeigt Kennzahlen aus `selfAnalyzer`.
- `useSymbolzeit` – liest Symbolphasen aus der YAML und steuert Farben dynamisch.


Weitere Module sind in Arbeit.

## Tools und Skripte
### Häufige Probleme
- `pnpm dev` startet nicht → Node-Version prüfen, `pnpm install` erneut ausführen.
- Symbolzeit stimmt nicht → Zeitzonen/Locale-Check, `symbolzeit.ts` debuggen.


### CLI-Kommandos
| Befehl/Skript | Funktion |
|---------------|----------|
| `./scripts/aeon.sh help` | Übersicht aller poetischen & technischen Befehle |
| `./scripts/aeon.sh cycle_start` | Startet lokalen Mandala-Zyklus |
| `./scripts/aeon.sh sigil_invoke` | Exportiert Sigillin & CREP-Dokumentation |
| `./scripts/aeon.sh chronopoem` | Erstellt `CHRONOPOEM.md` |
| `./scripts/aeon.sh onboarding` | Zeigt Onboarding-Ritus |
| `pnpm dev` | Startet Dev-Server (UI & API) |
| `pnpm docs:auto` | Generiert TypeDoc-API-Docs |
| `pnpm lint` | Führt statische Typprüfung aus |
| `pnpm test` | Führe Unit- & UI-Tests aus |
| `node scripts/refresh-handbook.js` | Synchronisiert Handbuch |
| `node scripts/setup-unifiedmandala.sh` | Installer & Initialisierung |
| `./scripts/repair-repo.sh` | Repariert Repository-Verbindungen |
| `node scripts/generate-api-docs.js` | Erstellt API-Dokumentation |
| `node scripts/generate-chronopoem.js` | Generiert neues Chronopoem |
| `node scripts/generate-todo-sigil.js` | Erzeugt `todo-sigil.yaml` |
| `node scripts/update-todo-sigil.js` | Aktualisiert todo-Sigil-Status |
| `node scripts/split-conversations.js` | Zerlegt `conversations.json` |
| `node scripts/filter-conversations.js` | Filtert `conversations.json` |
| `node scripts/parse-advanced-conversations.js` | Parst `advancedconversations.json` |
| `node scripts/analyze-conversations.js` | Analysiert Gespräche |
| `node scripts/generate-todo-from-convos.js` | Erstellt ToDo-Datei aus Convos |
| `node scripts/export-crep-docs.js` | Exportiert CREP-Daten |
| `node scripts/update-advanced-todo.js` | Aktualisiert Advanced-ToDo-Liste |
| `node scripts/update-advancedprogress.js` | Dokumentiert Fortschritt |
| `node scripts/update-kontext.js` | Passt Kontext-Datei an |
| `node scripts/extract-snippets.js` | Extrahiert Code-Snippets |
| `node scripts/extract_new_ai_fragments.js` | Extrahiert neue KI-Fragmente |
| `node scripts/check-todo-sigil.js` | Prüft erledigte Aufgaben |
| `node scripts/check-meta-score-layer.js` | Prüft Meta-Score-Layer |
| `node scripts/mark-fragment.js` | Markiert bearbeitete Fragmente |
| `node scripts/self-analyze.js` | Zeigt Repository-Statistiken |
| `node scripts/scan-todo-comments.js` | Scannt TODO-Kommentare |
| `node scripts/repotool-convo.js` | Schnelle Auswertung & Progress-Update |
| `node scripts/website-to-yaml.js` | Wandelt Webseite in YAML um |
| `node scripts/symbolzeit-runner.js` | Läuft Symbolzeit-Cronjob |
| `node packages/cli-tools/sigillin-cli.js convert beispiel.yaml` | YAML ↔ JSON-Konvertierung |
| `node packages/cli-tools/sigillin-cli.js todo-sigil` | Erzeugt todo-sigil aus Aufgabenlisten |
| `node packages/cli-tools/sigillin-cli.js grep-conversations TODO` | Filtert Conversations nach Keyword |
| `node packages/cli-tools/export-doc.js` | CREP-Historie als Markdown |
| `node packages/cli-tools/sigillin-archive.js` | Archiviert Sigillin-Dateien |
| `node packages/cli-tools/dispatchCmd.ts` | Dispatcher für diverse Befehle |

- `scripts/generate-api-docs.js` – Erstellt automatisch die API-Dokumentation mit Typedoc.
- `scripts/generate-todo-sigil.js` – Erstellt das ToDo-Sigil aus der Mastercanvas.
- `scripts/update-todo-sigil.js` – Markiert erledigte Aufgaben im ToDo-Sigil.
- `scripts/onboarding-ritual.md` – Leitfaden für den ersten Pull Request.
- `scripts/refresh-handbook.js` – Synct Auszüge aus der README ins Handbuch.

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

## Changelog
Aktuelle Versionshinweise werden in [CHANGELOG.md](CHANGELOG.md) gepflegt.

<!-- README_HIGHLIGHTS -->
## README-Highlights

## 🚀 Features

- 🧠 **CREP-Systematik** – Coherence, Resonance, Emergence, Poetics
- 🌀 **Sigillin-Logik** – Heimkehr-Trigger, Symbolphasen, SigillinMap
- 🌗 **Symbolzeit-Modulator** – morgen, tag, abend, nacht
- 🗺️ **MandalaNetworkView** – Visualisierung aller Sigillin-Knoten und CREP-Felder
- 🗂️ **SigillinLoader** – Import & Filter von Sigillin-Dateien
- 📚 **AutoDoc & Manifest-Generator** – Dokumentation auf Knopfdruck
- 🧩 **Plug-in-Architektur** – GPT-Kommunikationsmodule, CLI-Tools
- 🔐 **Ethik-Governance & Heimkehr-Deklaration** – Offene, poetische Ethik als Systembasis
- 🎭 **Poesie & Automation** – Bash-Interface (`aeon.sh`), automatisches Chronopoem, symbolisches Onboarding
- 🌟 **CREP-Illumination** – Chronopoem reflektiert aktuellen CREP-Zustand
- 🔍 **SelfAuditModul** – analysiert die Repository-Struktur
- 🎨 **SigillinViewer & SigillinMap** – Übersicht und Detailansicht aller Sigillin
- 🚩 **SymbolicWayfinder & SoforthilfeOverlay** – Navigation und Hilfedialoge
- 📈 **CREPChart & CREPTriggerPanel** – CREP-Historie und Steuerung
- 🛰️ **Nucleon-Scanner v0.6** – Analysiert tiefe Resonanzdaten
- 📐 **CREPBewertungsmodul** – berechnet Durchschnittswerte und Klassifizierung
- 📊 **CREPAverage-Analyse** – Durchschnittswerte aus dem CREP-Verlauf
- 🌠 **AeonStoryMode & Onboarding-Flow** – Präsentations- und Einstiegskomponenten
- 🎨 **MandalaThemeManager** – hell/dunkel umschalten
- ✨ **SigillinActivationManager & MetaSignatur** – Aktivierung & Signatur von Sigillin
- 📜 **SigillinTimeline & InviteBanner** – Verlauf und Einladungsbanner
- 💾 **BackupManager** – einfache Dateisicherungen
- 📢 **GlobalLoggingSystem** – zentrale Log-Schnittstelle
- 🗄️ **Big-File Sigil** – Konzept zum Aufteilen großer Dateien
- 📊 **CREPWirkungstracker** – misst den Effekt aus CREP-Daten
- ⚖️ **KarmaBalance** – verwaltet Karma-Punkte
- 🔮 **SymbolicForecaster** – sagt kommende Symbolzeit-Phasen voraus
- ⏱️ **SymbolzeitSync** – synchronisiert CREPGameEngine und SymbolzeitManager
- 🪄 **RitualCompiler** – wandelt Rituale in CREP-FSMs
- 🤝 **AutomergeFederation** – führt verteilte Edits automatisch zusammen
- 🛡️ **MandalaCoreLicense** – ethisches Lizenzmodell für Module

## 📦 Paketstruktur

```bash
packages/
  ├── genesis-sigillin-core     # Sigillin-Logik, JSON-Schema, Generator
  ├── unifiedmandala-ui         # React-Komponenten (MandalaNetworkView, Dialoge)
  ├── crep-engine               # CREP-Zustandssimulation, Evaluator, Scanner
  ├── gpt-bridges               # Mitt-basierter EventHub für GPT-Module
  ├── cli-tools                 # CLI: sigillin-cli, export-doc, Archivierung
  ├── aeon-shell                # Symbolzeit & CLI-Trigger
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
  ├── shared-utils              # Hilfsfunktionen für alle Pakete
  │   └── RestClient.ts         # einfacher REST-Helper
  └── codex-navigator-agent     # Parser für Codex-Instruktionen
codex/                    # Codex-Workflows und Sigillin-Dateien
codexbuild/               # Build-Skripte und Deploy-Hilfen
ci/                      # Test- und Pipeline-Konfigurationen
config/                  # Zentrale YAML- und Env-Dateien
repositorypflege/         # Pflegekonzepte und Repository-Mapping
apps/
  └── sharedream-interface      # Web-Schnittstelle & Sync

scripts/
  ├── aeon.sh                   # Poetisches Bash-CLI für Mandala-Steuerung
  ├── setup-unifiedmandala.sh   # Installer & Initialisierung
  ├── generate-chronopoem.js    # Poetische Commit-Signatur
  └── onboarding-ritual.md      # Onboarding-Ritus für neue Contributors
```

Jeder Unterordner kann eine eigene README enthalten – siehe die Links in den jeweiligen Verzeichnissen.
Utilities liegen in `packages/shared-utils/`, weitere Module findest du ebenfalls unter `packages/`.

## 💻 Schnellstart

```bash
# Node.js ≥ 18 & pnpm installiert
git clone https://github.com/GenesisAeon/unified-mandala.git
cd unified-mandala
./scripts/setup-unifiedmandala.sh
pnpm dev
```
Die generierte API-Dokumentation findest du danach unter `docs/api`.

Für `npm` oder `yarn` nutze alternativ:

```bash
npm install   # oder: yarn install
npm run build # oder: yarn build
npm run dev   # oder: yarn dev
```

## 🌀 Mandala-Poesie und Automation

| Befehl/Skript | Funktion |
|---------------|----------|
| `./scripts/aeon.sh help` | Übersicht aller poetischen & technischen Befehle |
| `./scripts/aeon.sh cycle_start` | Startet lokalen Mandala-Zyklus |
| `./scripts/aeon.sh sigil_invoke` | Exportiert Sigillin & CREP-Dokumentation |
| `./scripts/aeon.sh chronopoem` | Erstellt `CHRONOPOEM.md` |
| `./scripts/aeon.sh onboarding` | Zeigt Onboarding-Ritus |
| `pnpm dev` | Startet Dev-Server (UI & API) |
| `pnpm docs:auto` | Generiert TypeDoc-API-Docs |
| `pnpm lint` | Führt statische Typprüfung aus |
| `pnpm test` | Führe Unit- & UI-Tests aus |
| `node scripts/refresh-handbook.js` | Synchronisiert Handbuch |
| `node scripts/setup-unifiedmandala.sh` | Installer & Initialisierung |
| `./scripts/repair-repo.sh` | Repariert Repository-Verbindungen |
| `node scripts/generate-api-docs.js` | Erstellt API-Dokumentation |
| `node scripts/generate-chronopoem.js` | Generiert neues Chronopoem |
| `node scripts/generate-todo-sigil.js` | Erzeugt `todo-sigil.yaml` |
| `node scripts/update-todo-sigil.js` | Aktualisiert todo-Sigil-Status |
| `node scripts/split-conversations.js` | Zerlegt `conversations.json` |
| `node scripts/filter-conversations.js` | Filtert `conversations.json` |
| `node scripts/parse-advanced-conversations.js` | Parst `advancedconversations.json` |
| `node scripts/analyze-conversations.js` | Analysiert Gespräche |
| `node scripts/generate-todo-from-convos.js` | Erstellt ToDo-Datei aus Convos |
| `node scripts/export-crep-docs.js` | Exportiert CREP-Daten |
| `node scripts/update-advanced-todo.js` | Aktualisiert Advanced-ToDo-Liste |
| `node scripts/update-advancedprogress.js` | Dokumentiert Fortschritt |
| `node scripts/update-kontext.js` | Passt Kontext-Datei an |
| `node scripts/extract-snippets.js` | Extrahiert Code-Snippets |
| `node scripts/extract_new_ai_fragments.js` | Extrahiert neue KI-Fragmente |
| `node scripts/check-todo-sigil.js` | Prüft erledigte Aufgaben |
| `node scripts/check-meta-score-layer.js` | Prüft Meta-Score-Layer |
| `node scripts/mark-fragment.js` | Markiert bearbeitete Fragmente |
| `node scripts/self-analyze.js` | Zeigt Repository-Statistiken |
| `node scripts/scan-todo-comments.js` | Scannt TODO-Kommentare |
| `node scripts/repotool-convo.js` | Schnelle Auswertung & Progress-Update |
| `node scripts/website-to-yaml.js` | Wandelt Webseite in YAML um |
| `node scripts/symbolzeit-runner.js` | Läuft Symbolzeit-Cronjob |
| `node packages/cli-tools/sigillin-cli.js convert beispiel.yaml` | YAML ↔ JSON-Konvertierung |
| `node packages/cli-tools/sigillin-cli.js todo-sigil` | Erzeugt todo-sigil aus Aufgabenlisten |
| `node packages/cli-tools/sigillin-cli.js grep-conversations TODO` | Filtert Conversations nach Keyword |
| `node packages/cli-tools/export-doc.js` | CREP-Historie als Markdown |
| `node packages/cli-tools/sigillin-archive.js` | Archiviert Sigillin-Dateien |
| `node packages/cli-tools/dispatchCmd.ts` | Dispatcher für diverse Befehle |



Weitere Beispiele und GIF-Demos findest du im [Wiki](https://github.com/GenesisAeon/unified-mandala/wiki).
Ein SVG-Beispiel liegt unter [`docs/assets/unified-mandala.svg`](docs/assets/unified-mandala.svg).

Das `CHRONOPOEM.md` entsteht automatisch – und kann bei jedem Commit erneuert werden.
