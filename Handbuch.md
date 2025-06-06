# UnifiedMandala Handbuch

Dieses Handbuch gibt einen Überblick über die wichtigsten Module und Funktionen des Repositories.

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
- `aeon-gpt-synapse.ts` – Stub zur Kommunikation mit GPT-APIs.
- `GPT_AEONPOET` – Beispielhafter poetischer GPT-Ausdruck.
- `GPT_CREPJUDGE` – Bewertet CREP-Werte.

### genesis-sigillin-core
- `SigillinGenerator` – Erstellt und validiert Sigillin-Dateien.
- `SigillinActivationManager` – Verwalten aktiver Sigillin.
- `SigillinSyncManager` – Synchronisiert Status über WebSocket oder BroadcastChannel.
- `SigillinMetaSignatur` – Erzeugt eine Prüfsumme eines Objekts.

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

### unifiedmandala-ui (Auswahl)
- `MandalaNetworkView` – Visualisierung der Sigillin-Knoten als D3-Graph.
- `CREPChart` – Linienchart für CREP-Werte.
- `CREPTriggerPanel` – Buttons zum Auslösen von CREP-Ereignissen.
- `LiveCREPPanel` – Kombiniert Trigger und Chart für Live-Daten.
- `SigillinLoader` – Lädt Sigillin-Dateien und filtert Einträge.
- `SelfAuditModul` – Zeigt Kennzahlen aus `selfAnalyzer`.


Weitere Module sind in Arbeit.

## Tools und Skripte
- `scripts/generate-api-docs.js` – Erstellt automatisch die API-Dokumentation mit Typedoc.
- `scripts/generate-todo-sigil.js` – Erstellt das ToDo-Sigil aus der Mastercanvas.
- `scripts/update-todo-sigil.js` – Markiert erledigte Aufgaben im ToDo-Sigil.

## Ausblick
Dieses Handbuch deckt die wichtigsten Bereiche ab. Eine detaillierte Beschreibung aller Komponenten ist noch offen.
