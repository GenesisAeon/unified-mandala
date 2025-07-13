# AeonUniversal DSL

Dieses Dokument beschreibt die Grundstruktur der *AeonUniversal DSL* zur Definition von Mandala-Workflows.

## 1. Syntaxübersicht

Ein DSL-Dokument ist im YAML-Format aufgebaut und besteht aus einer Liste von **Tasks**. Jeder Task enthält ein Plugin, optionale Konfiguration und Eingabedaten.

```yaml
- task: FourierAnalysis
  plugin: FourierLayer
  input:
    data: [1, 0, 1, 0]
  config:
    window: hamming
```

## 2. Schlüsselwörter

| Feld      | Bedeutung                                      |
|-----------|------------------------------------------------|
| `task`    | Name des Arbeitsschritts                       |
| `plugin`  | Referenz auf ein analysierendes Modul          |
| `input`   | Datenquelle oder Inline-Daten                  |
| `config`  | Plugin-spezifische Optionen                    |

## 3. Compiler Hooks

Der DSL-Compiler ruft bei jedem Task folgende Hooks auf:

1. **preValidate(task)** – überprüft Struktur und Pflichtfelder
2. **execute(task)** – führt das angegebene Plugin aus
3. **postProcess(result)** – bereitet Ergebnisse für Folge-Tasks auf

## 4. Beispielablauf

```yaml
- task: SigilScan
  plugin: SigilManager
  input:
    path: sigils/*.yaml
- task: CREPAnalysis
  plugin: CREPEngine
  input:
    source: prev
  config:
    method: advanced
```

Dieses Minimalbeispiel scannt zunächst Sigil-Dateien und führt anschließend eine CREP-Analyse durch.

---
*Stand: Entwurfsversion – weitere Sprachkonstrukte folgen in kommenden Updates.*
