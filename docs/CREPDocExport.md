# CREPDocExport

Dieses Dokument beschreibt die Exportstruktur der CREP-Daten. Die CREP-Engine erzeugt JSON-Dateien, die alle Einträge nach Symbolzeit sortiert enthalten. Jeder Export besteht aus einer Liste von Objekten mit `timestamp`, `symbolzeit` und `crepValue`.

## Dateiformat

Die Exportdatei ist eine JSON‑Liste. Jedes Element repräsentiert einen Messpunkt der CREP‑Werte und besitzt folgende Felder:

| Feld       | Typ     | Beschreibung                                |
|------------|---------|---------------------------------------------|
| `timestamp`| string  | ISO‑Datum des Messzeitpunkts               |
| `symbolzeit` | string | Symbolische Zeitangabe (z. B. `morgen`) |
| `crepValue` | object | Objekt mit `C`, `R`, `E` und `P` Komponenten |

## Beispiel

```json
[
  {
    "timestamp": "2025-01-01T12:00:00Z",
    "symbolzeit": "tag",
    "crepValue": { "C": 0.8, "R": 0.6, "E": 0.7, "P": 0.9 }
  }
]
```

## Erstellung

Ein Export kann über das CLI‑Skript `packages/cli-tools/export-doc.js` generiert werden:

```bash
node packages/cli-tools/export-doc.js
```

Die Ausgabe wird als `CREPDocExport.md` im Projektstamm abgelegt und lässt sich anschließend in weitere Formate überführen.
