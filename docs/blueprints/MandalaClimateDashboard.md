# Mandala Climate Dashboard Blueprint

Dieses Blueprint fasst die geplante Umsetzung des Mandala Climate Dashboards zusammen. Ziel ist eine React/TypeScript-Anwendung mit Tailwind, shadcn/ui und Recharts, die Klimakennzahlen, Hydro-Whiplash-Indikatoren, Geophysik-Kacheln sowie MRV/STAC-Export vereint.

## Verzeichnisstruktur
- `src/pages/ClimateMandalaDashboard.tsx` – zentrale Dashboard-Seite
- `src/components/GeophysikSection.tsx` – Karten für geophysikalische KPIs
- `src/utils/` – Typdefinitionen, Qualitätskontrollen und MRV-Tools
- `src/adapters/` – Datenadapter (ERA5, OISST, EFFIS, Pegel, Biodiversität, DWD-Radar, SPEI)
- `src/modules/ki/` – BayesDesigner, RLCSOAgent und Evolution-Green Module
- `src/config/` – Schwellenwerte und Alarmregeln als YAML

## Umsetzungsschritte
1. Hilfsfunktionen und Adapter als Stubs anlegen
2. KI-Module und Geophysik-Komponenten implementieren
3. Dashboard-Seite mit Recharts und Export-Funktionen erstellen
4. Schwellenwerte/Alert-Regeln konfigurieren und Tests integrieren

Dieses Dokument dient als Referenz für die folgenden ToDos.

