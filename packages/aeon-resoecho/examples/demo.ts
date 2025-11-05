/**
 * Demo: ResoEcho - Das Gedächtnis des Mandalas
 *
 * Dieses Beispiel zeigt, wie ResoEcho verwendet wird, um
 * CREP-Messungen zu speichern, Muster zu erkennen und
 * intelligentes Feedback zu geben.
 */

import { ResoEcho } from '../src/index';
import { computeCREP } from '@mandala/crep';
import type { Graph } from '@mandala/crep';

// Initialisiere ResoEcho
const resoEcho = new ResoEcho({
  maxEchoes: 100,
  patternThreshold: 0.7,
  trendWindowMs: 60 * 60 * 1000, // 1 Stunde
});

console.log('🌀 ResoEcho Demo - Das Mandala erinnert sich\n');

// === 1. Speichere verschiedene CREP-Messungen ===
console.log('1️⃣  Speichere CREP-Messungen...\n');

// Simulation: Agent-Interaktionen mit hoher Emergenz
for (let i = 0; i < 5; i++) {
  const graph: Graph = {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { source: 'A', target: 'B', weight: 1 },
      { source: 'B', target: 'C', weight: 0.8 },
      { source: 'C', target: 'D', weight: 0.9 },
      { source: 'D', target: 'E', weight: 1 },
    ],
    labels: { A: 1, B: 1, C: 2, D: 2, E: 3 },
  };

  const crep = computeCREP(graph);
  const echo = resoEcho.remember(crep, 'agent-interaction', {
    agentId: `agent-${i}`,
    timestamp: Date.now(),
  });

  console.log(`   ✓ Echo ${echo.id.slice(0, 20)}...`);
  console.log(`     → Emergenz: ${crep.emergence.toFixed(2)}`);
}

// Simulation: Daten-Pipeline mit stabiler Kohärenz
console.log('\n   Daten-Pipeline Messungen...\n');
for (let i = 0; i < 5; i++) {
  const graph: Graph = {
    nodes: ['X', 'Y', 'Z'],
    edges: [
      { source: 'X', target: 'Y', weight: 1 },
      { source: 'Y', target: 'Z', weight: 1 },
    ],
    labels: { X: 1, Y: 1, Z: 1 },
  };

  const crep = computeCREP(graph);
  resoEcho.remember(crep, 'data-pipeline');
  console.log(`   ✓ Kohärenz: ${crep.coherence.toFixed(2)}`);
}

// === 2. Statistiken anzeigen ===
console.log('\n2️⃣  Statistiken:\n');
const stats = resoEcho.stats();
console.log(`   📊 Total Echoes: ${stats.totalEchoes}`);
console.log(`   📂 Contexts: ${stats.contexts.join(', ')}`);
console.log(`   ⏰ Zeitspanne: ${new Date(stats.oldestTimestamp!).toLocaleTimeString()} - ${new Date(stats.newestTimestamp!).toLocaleTimeString()}`);
console.log(`   🌀 Durchschnittliche CREP:`);
console.log(`      C: ${stats.averageCREP!.coherence.toFixed(2)}`);
console.log(`      R: ${stats.averageCREP!.resonance.toFixed(2)}`);
console.log(`      E: ${stats.averageCREP!.emergence.toFixed(2)}`);
console.log(`      P: ${stats.averageCREP!.poetics.toFixed(2)}`);

// === 3. Ähnlichkeits-Suche ===
console.log('\n3️⃣  Ähnlichkeits-Suche:\n');
const targetGraph: Graph = {
  nodes: ['A', 'B', 'C'],
  edges: [{ source: 'A', target: 'B' }],
  labels: { A: 1, B: 1, C: 2 },
};
const targetCREP = computeCREP(targetGraph);

console.log(`   🎯 Suche nach ähnlichen Messungen zu:`);
console.log(`      CREP: ${targetCREP.crep.toFixed(2)}`);

const similar = resoEcho.findSimilar(targetCREP, 3, 0.7);
console.log(`   ✓ ${similar.length} ähnliche Echos gefunden:`);
similar.forEach((echo, i) => {
  console.log(`      ${i + 1}. Context: ${echo.context}, CREP: ${echo.crep.crep.toFixed(2)}`);
});

// === 4. Muster-Erkennung ===
console.log('\n4️⃣  Muster-Erkennung:\n');
const patterns = resoEcho.detectPatterns();
console.log(`   🔍 ${patterns.length} Muster erkannt:\n`);
patterns.forEach((pattern, i) => {
  console.log(`   ${i + 1}. ${pattern.type}`);
  console.log(`      Confidence: ${(pattern.confidence * 100).toFixed(1)}%`);
  console.log(`      ${pattern.description}`);
  console.log(`      Durchschnitt: C=${pattern.averageCREP.coherence.toFixed(2)}, E=${pattern.averageCREP.emergence.toFixed(2)}\n`);
});

// === 5. Intelligentes Feedback ===
console.log('5️⃣  Intelligentes Feedback:\n');
const feedback = resoEcho.getFeedback(targetCREP, 'agent-interaction');

console.log(`   📊 Trends:`);
console.log(`      Kohärenz: ${feedback.trends.coherence}`);
console.log(`      Resonanz: ${feedback.trends.resonance}`);
console.log(`      Emergenz: ${feedback.trends.emergence}`);
console.log(`      Poetik: ${feedback.trends.poetics}`);

console.log(`\n   💡 Empfehlungen:`);
feedback.recommendations.forEach((rec, i) => {
  console.log(`      ${i + 1}. ${rec}`);
});

console.log(`\n   🔄 ${feedback.similarEchoes.length} ähnliche historische Situationen gefunden`);
console.log(`   🎯 ${feedback.patterns.length} relevante Muster identifiziert`);

// === 6. Export & Import Demo ===
console.log('\n6️⃣  Export & Import:\n');
const exported = resoEcho.export();
console.log(`   💾 Exportiert: ${exported.length} Echoes`);

const newResoEcho = new ResoEcho();
newResoEcho.import(exported);
console.log(`   📥 Importiert: ${newResoEcho.stats().totalEchoes} Echoes`);
console.log(`   ✓ Backup & Restore funktioniert!`);

// === 7. Kontext-spezifisches Recall ===
console.log('\n7️⃣  Kontext-spezifisches Abrufen:\n');
const agentEchoes = resoEcho.recall('agent-interaction');
const pipelineEchoes = resoEcho.recall('data-pipeline');

console.log(`   🤖 Agent-Interaktionen: ${agentEchoes.length} Echoes`);
console.log(`   📊 Daten-Pipeline: ${pipelineEchoes.length} Echoes`);

console.log('\n✨ Demo abgeschlossen! Das Mandala hat sich erinnert. ✨\n');

/**
 * Erwartete Ausgabe:
 *
 * - ResoEcho speichert 10 CREP-Messungen (5 agent, 5 pipeline)
 * - Erkennt mindestens 1-2 Muster (high-emergence, stable-coherence)
 * - Findet ähnliche historische Messungen
 * - Gibt kontextbezogene Empfehlungen
 * - Zeigt Trends über Zeit
 * - Demonstriert Export/Import für Persistierung
 */
