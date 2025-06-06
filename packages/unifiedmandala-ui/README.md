# UnifiedMandala UI

React-Komponenten für das Mandala-Frontend.

## Komponenten
- **MandalaNetworkView** – D3-Netzwerk aller Sigillin-Knoten
- **CREPChart** – Visualisierung der CREP-Historie
- **CREPTriggerPanel** – Anzeige und Steuerung von CREP-Events
- **SigillinLoader** – Laden und Filtern von Sigillin-Dateien
- **SigillinViewer** – Darstellung einzelner Sigillin-Daten
- **SigillinMap** – Übersicht aller bekannten Sigillin
- **MandalaMap** – einfache SVG-Karte der Mandala-Knoten
- **SoforthilfeOverlay** – Kontextabhängige Hilfedialoge
- **SymbolicWayfinder** – Navigations-Komponente für das Mandala
- **AeonStoryMode** – Präsentationsmodus mit poetischen Sequenzen
- **onboarding-flow** – Einstiegskomponente für neue Nutzer
- **SelfAuditModul** – zeigt Kennzahlen des Repositories an
- **LiveCREPPanel** – kombiniert Trigger und Chart für Live-Daten

## Hooks
- **useSymbolzeit** – liefert aktuelle Symbolzeit-Phase
- **useCREP** – Zugriff auf CREP-Historie und Trigger
- **CREPContext** – stellt CREP-Daten via React Context bereit

Zusätzlich stellt `shared-utils` die Funktion **getCREPPhaseColor** bereit,
um CREP-Werte in Farbzustände zu übersetzen.

