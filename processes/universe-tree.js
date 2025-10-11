import fs from 'fs';
import path from 'path';
const outDir = process.env.OUT_DIR || 'runs';
const runId = process.env.RUN_ID || Date.now().toString();
const target = path.join(outDir, runId, 'artifacts', 'tree.json');
fs.mkdirSync(path.dirname(target), { recursive: true });
const tree = { R0: ['R1', 'R2'], R1: ['R1a', 'R1b'], R2: ['R2a'] };
fs.writeFileSync(target, JSON.stringify(tree, null, 2));
console.log('[universe-tree] wrote', target);
