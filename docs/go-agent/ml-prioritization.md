# ML-Prioritization for Go Agent

Der Go Agent kann Aufgaben anhand von ML-basierten Scores priorisieren. Dieses Dokument beschreibt den Ablauf.

## Workflow
1. **Feature Extraction** – Eingehende Aufgaben werden analysiert und in numerische Feature-Vektoren umgewandelt.
2. **Modellbewertung** – Ein leichtgewichtiges Modell (z.B. logistisches Regressionsmodell) berechnet einen Prioritätsscore zwischen 0 und 1.
3. **Scheduler** – Der Scheduler sortiert Aufgaben nach Score und Gewichtung.

## Konfiguration
```yaml
# examples/go-agent/prioritization-example.yaml
job: "analyze-sigil"
features:
  size: 120
  urgency: 0.8
model: logistic-regression
```

## Hinweise
- Modelle liegen unter `go-agent/pkg/ml/`.
- Scores können optional mit CREP-Werten kombiniert werden.
- Fallback auf statische Prioritäten, falls das Modell keine Vorhersage liefert.

