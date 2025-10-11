import fs from 'fs';
import path from 'path';
const outDir = process.env.OUT_DIR || 'runs';
const runId = process.env.RUN_ID || Date.now().toString();
const target = path.join(outDir, runId, 'artifacts', 'seed_results.json');
fs.mkdirSync(path.dirname(target), { recursive: true });
const results = [
  { modelName: 'emergence_predictor', crepResonance: 0.72 },
  { modelName: 'consent_mesh_sim', crepResonance: 0.64 },
];
fs.writeFileSync(target, JSON.stringify(results, null, 2));
console.log('[seed-models] wrote', target);
