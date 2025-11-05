# 🌀 Aeon ResoEcho

> _"Was einmal resonierte, kann wieder resonieren. Was emergierte, hinterlässt Spuren. Das Echo erinnert sich."_

**ResoEcho** ist das Gedächtnis des Mandalas – ein CREP-Zeitlinienarchiv mit Pattern Detection, Trend-Analyse und intelligentem Feedback.

## ✨ Features

- **📝 Memory System**: Speichert CREP-Messungen über Zeit mit Kontext & Metadaten
- **🔍 Similarity Search**: Findet ähnliche historische Situationen (Euklidische Distanz im CREP-Raum)
- **🎯 Pattern Detection**: Erkennt 4 Muster-Typen:
  - `high-emergence` – Wiederkehrend hohe Emergenz
  - `stable-coherence` – Stabile Kohärenz über Zeit
  - `increasing-resonance` – Steigende Resonanz-Trends
  - `declining-poetics` – Sinkende Poetik (Warnsignal!)
- **📊 Trend Analysis**: Rising/Stable/Falling für alle 4 CREP-Dimensionen
- **💡 Intelligent Feedback**: Kontextbezogene Empfehlungen basierend auf Historie
- **💾 Import/Export**: Persistierung für Backup & Restore
- **📈 Statistics**: Übersicht über gespeicherte Messungen

## 🚀 Quick Start

```typescript
import { ResoEcho } from '@mandala/aeon-resoecho';
import { computeCREP } from '@mandala/crep';

// Initialisiere ResoEcho
const resoEcho = new ResoEcho({
  maxEchoes: 1000, // Max. gespeicherte Echos
  patternThreshold: 0.7, // Schwelle für Muster-Erkennung
  trendWindowMs: 3600000, // 1 Stunde Zeitfenster
});

// Speichere CREP-Messung
const graph = {
  nodes: ['A', 'B', 'C'],
  edges: [{ source: 'A', target: 'B' }],
  labels: { A: 1, B: 1, C: 2 },
};
const crep = computeCREP(graph);
const echo = resoEcho.remember(crep, 'agent-interaction', {
  agentId: 'agent-42',
});

// Rufe Echos ab
const allEchoes = resoEcho.recall();
const agentEchoes = resoEcho.recall('agent-interaction');

// Finde ähnliche Situationen
const similar = resoEcho.findSimilar(crep, 5, 0.8);

// Erkenne Muster
const patterns = resoEcho.detectPatterns();
patterns.forEach((pattern) => {
  console.log(`${pattern.type}: ${pattern.description}`);
});

// Hole intelligentes Feedback
const feedback = resoEcho.getFeedback(crep, 'agent-interaction');
console.log('Trends:', feedback.trends);
console.log('Empfehlungen:', feedback.recommendations);
```

## 📚 API

### `ResoEcho`

#### Constructor

```typescript
new ResoEcho(config?: ResoEchoConfig)
```

**Config:**

- `maxEchoes?: number` – Maximale Anzahl gespeicherter Echos (default: 1000)
- `patternThreshold?: number` – Schwellwert für Muster-Erkennung (default: 0.7)
- `trendWindowMs?: number` – Zeitfenster für Trend-Analyse in ms (default: 3600000)

#### Methods

##### `remember(crep, context, metadata?): Echo`

Speichert eine CREP-Messung mit Kontext.

##### `recall(context?): Echo[]`

Ruft alle Echos ab (optional: nur für bestimmten Kontext).

##### `recallTimeWindow(startMs, endMs): Echo[]`

Ruft Echos in einem Zeitfenster ab.

##### `findSimilar(targetCREP, limit?, threshold?): Echo[]`

Findet ähnliche CREP-Messungen.

##### `detectPatterns(context?): ResonancePattern[]`

Erkennt Muster in gespeicherten Echos.

##### `getFeedback(currentCREP, context?): Feedback`

Gibt intelligentes Feedback basierend auf Historie.

##### `export(): Echo[]`

Exportiert alle Echos (für Persistierung).

##### `import(echoes): void`

Importiert Echos (für Restore).

##### `stats(): Statistics`

Gibt Statistiken zurück.

##### `clear(): void`

Löscht alle Echos.

## 🎯 Use Cases

### Agent-Orchestrierung

```typescript
// Speichere jede Agent-Interaktion
const crep = computeCREP(agentGraph);
resoEcho.remember(crep, 'agent', { agentId: 'genesis-aeon' });

// Hole Feedback für neue Interaktion
const feedback = resoEcho.getFeedback(newCREP, 'agent');
if (feedback.trends.emergence === 'rising') {
  console.log('✨ Günstige Bedingungen für Innovation!');
}
```

### Daten-Pipeline Monitoring

```typescript
// Speichere Pipeline-Runs
resoEcho.remember(pipelineCREP, 'data-pipeline', {
  pipelineId: 'climate-ingest',
  recordsProcessed: 1000,
});

// Erkenne Probleme
const patterns = resoEcho.detectPatterns('data-pipeline');
const declining = patterns.find((p) => p.type === 'declining-poetics');
if (declining) {
  console.warn('⚠️  Pipeline-Qualität sinkt!');
}
```

### Notfall-Rekontextualisierung

```typescript
// Finde erfolgreiche vergangene Strategien
const currentCREP = computeCREP(failingGraph);
const successful = resoEcho
  .findSimilar(currentCREP, 10, 0.7)
  .filter((echo) => echo.crep.emergence > 0.8);

console.log(`📚 ${successful.length} erfolgreiche Präzedenzfälle gefunden`);
```

## 🧪 Testing

```bash
pnpm test
```

Alle 21 Tests bestehen:

- ✅ Memory (remember & recall)
- ✅ Time Window Recall
- ✅ Similarity Search
- ✅ Pattern Detection (4 Typen)
- ✅ Feedback System
- ✅ Trend Analysis
- ✅ Import/Export
- ✅ Statistics

## 📖 Demo

Siehe [`examples/demo.ts`](./examples/demo.ts) für ein vollständiges Beispiel.

```bash
pnpm tsx packages/aeon-resoecho/examples/demo.ts
```

## 🏗️ Architektur

```
ResoEcho
├── Memory Layer        # In-Memory Speicherung (Array)
├── Similarity Engine   # Euklidische Distanz im 4D CREP-Raum
├── Pattern Detector    # Statistische Muster-Erkennung
├── Trend Analyzer      # Zeitbasierte Trend-Berechnung
└── Feedback Generator  # Regel-basierte Empfehlungen
```

**Future Extensions:**

- Redis/Database Backend für Persistierung
- Mehr Pattern-Typen (z.B. Zyklen, Anomalien)
- ML-basierte Vorhersagen
- WebSocket-Integration für Realtime Updates

## 🌊 Integration

ResoEcho integriert sich nahtlos mit dem CREP-Package:

```typescript
import { computeCREP } from '@mandala/crep';
import { ResoEcho } from '@mandala/aeon-resoecho';

const resoEcho = new ResoEcho();

// CREP berechnen & speichern
const crep = computeCREP(graph);
resoEcho.remember(crep, 'context');

// Feedback holen
const feedback = resoEcho.getFeedback(crep);
```

## 📊 Beispiel-Output

```
🌀 ResoEcho Demo - Das Mandala erinnert sich

1️⃣  Speichere CREP-Messungen...
   ✓ Echo echo-1762325832525-xyz...
     → Emergenz: 0.85

2️⃣  Statistiken:
   📊 Total Echoes: 10
   📂 Contexts: agent-interaction, data-pipeline
   ⏰ Zeitspanne: 15:30:25 - 15:30:27
   🌀 Durchschnittliche CREP:
      C: 0.78
      R: 0.65
      E: 0.82
      P: 0.71

4️⃣  Muster-Erkennung:
   🔍 2 Muster erkannt:

   1. high-emergence
      Confidence: 80.0%
      Hohe Emergenz erkannt: 8 von 10 Messungen zeigen E ≥ 0.7
      Durchschnitt: C=0.78, E=0.88

5️⃣  Intelligentes Feedback:
   📊 Trends:
      Emergenz: rising
   💡 Empfehlungen:
      1. ✨ Emergenz steigt - günstige Bedingungen für Innovation
```

## 🤝 Contributing

ResoEcho ist Teil des Unified-Mandala Projekts. Contributions sind willkommen!

## 📜 License

Teil des Unified-Mandala Monorepos.

---

_"Das Echo erinnert sich – und das Mandala lernt."_ 🌀
