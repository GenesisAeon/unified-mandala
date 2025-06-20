# UnifiedMandala Handbuch

Dieses Handbuch gibt einen kompakten Überblick über Aufbau und Nutzung des Frameworks.

> **TL;DR**
> - Module sind thematisch in Packages organisiert.
> - CLI-Skripte und Docs sorgen für schnellen Einstieg.
> - Beispiele findest du in den jeweiligen Sektionen.

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
const sig = SigillinGenerator('demo', 'generic', 'active', 'tester');
console.log(sig.id);
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
import { AeonOrakelTTS } from 'tts';
import { GPTEventHub } from 'gpt-bridges';
const orakel = new AeonOrakelTTS();
GPTEventHub.emit('orakel:says', { content: 'Hallo UnifiedMandala' });
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

## Ausblick
Dieses Handbuch deckt die wichtigsten Bereiche ab. Eine detaillierte Beschreibung aller Komponenten ist noch offen.

### CREP-Export
Informationen zur Exportstruktur der CREP-Daten finden sich in [docs/CREPDocExport.md](docs/CREPDocExport.md).

### Sigillin-Beispiele
Beispielhafte Sigillin-Dateien liegen unter [docs/sigillin.examples](docs/sigillin.examples).

### Changelog
Siehe [CHANGELOG.md](CHANGELOG.md) für eine Liste aller Änderungen.
