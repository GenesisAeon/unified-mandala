# UnifiedMandala Handbuch

Dieses Handbuch gibt einen Überblick über die wichtigsten Module und Funktionen des Repositories.

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
- `loadSymbolphasen` – liest die Symbolphasen-Definition aus `config/symbolphasen.yaml`.

### core
- `AeonMemory` – Persistiert Aufgaben in `mandala-chronik.yaml`.
- `TriggerArchive` – Hält Timeline von Triggern und React-Hook.

### agents
- `PoeticReactorAgent` – Generiert Haikus bei hohen CREP-Werten.
- `GenesisAeonNavigator` – Schaltet Phasen anhand Sigillin frei.

### collab-editor
- `CollaborativeEditor` – Federated Texteditor mit Remote-Sync.

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
  └── shared-utils              # Hilfsfunktionen für alle Pakete
repositorypflege/
  ├── repo-konzept.yaml        # Struktur- und Pflegehinweise
  └── repository_map.yaml      # Übersicht aller Teilrepositorien
scripts/
  ├── aeon.sh                   # Poetisches Bash-CLI für Mandala-Steuerung
  ├── setup-unifiedmandala.sh   # Installer & Initialisierung
  ├── generate-chronopoem.js    # Poetische Commit-Signatur
  └── onboarding-ritual.md      # Onboarding-Ritus für neue Contributors
```

Jeder Unterordner kann eine eigene README enthalten – siehe die Links in den jeweiligen Verzeichnissen.

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

```bash
chmod +x scripts/aeon.sh
./scripts/aeon.sh help             # Übersicht aller poetischen & technischen Befehle
./scripts/aeon.sh cycle_start      # startet lokalen Mandala-Zyklus
./scripts/aeon.sh sigil_invoke     # exportiert Sigillin & CREP-Dokumentation
./scripts/aeon.sh chronopoem       # erzeugt CHRONOPOEM.md
./scripts/aeon.sh onboarding       # zeigt Onboarding-Ritus + aktuellen Chronopoem
node packages/cli-tools/sigillin-cli.js convert beispiel.yaml # YAML ↔ JSON-Konvertierung
node packages/cli-tools/sigillin-cli.js todo-sigil           # aktualisiert todo-sigil.yaml
node scripts/generate-todo-sigil.js      # todo-sigil ohne Abhängigkeiten erzeugen
node scripts/update-todo-sigil.js        # Status im todo-sigil.yaml aktualisieren
node scripts/split-conversations.js 50   # zerlegt conversations.json in 50er-Stücke
node packages/cli-tools/sigillin-cli.js grep-conversations TODO # filtert conversations.json nach Keyword
node scripts/extract-snippets.js          # extrahiert Code-Snippets aus conversations.json
node scripts/self-analyze.js          # zeigt Repository-Statistiken
node scripts/check-todo-sigil.js      # prüft erledigte Aufgaben
node scripts/mark-fragment.js ID      # zeichnet bearbeitete Conversation-Fragmente
node scripts/analyze-conversations.js # wertet conversations.json aus
node scripts/generate-todo-from-convos.js # erzeugt todo-from-convos.yaml aus advancedconversations.json
node scripts/repotool-convo.js       # schnelle Auswertung und Progress-Update
node scripts/update-advancedprogress.js dokumentiert # Fortschrittsdatei aktualisieren
```

Weitere Beispiele und GIF-Demos findest du im [Wiki](https://github.com/GenesisAeon/unified-mandala/wiki).
Ein SVG-Beispiel liegt unter [`docs/assets/unified-mandala.svg`](docs/assets/unified-mandala.svg).

Das `CHRONOPOEM.md` entsteht automatisch – und kann bei jedem Commit erneuert werden.
