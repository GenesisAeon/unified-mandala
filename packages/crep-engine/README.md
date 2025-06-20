# CREP Engine

Verwaltet CREP-Werte und bewertet neue Datenpunkte.

Enthält:
- **CREPManager** – Speicherung der Historie und Event-Emission
- **getAverageCREP** – ermittelt Durchschnittswerte über die letzten Einträge
- **CREPEvaluator** – Threshold-Logik und State-Berechnung
- **getCREPState** – Hilfsfunktion für Status "safe", "warning" oder "critical"
- **CREPBewertungsmodul** – Berechnet Durchschnitt und Klassifizierung

