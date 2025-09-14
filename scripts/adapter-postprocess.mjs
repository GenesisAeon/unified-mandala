import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const name = process.argv[2];
if (!name) {
  console.error('usage: node adapter-postprocess.mjs <name>');
  process.exit(1);
}

mkdirSync('out', { recursive: true });
const indexPath = 'out/adapters_index.json';
let index = { adapters: [] };
if (existsSync(indexPath)) {
  try { index = JSON.parse(readFileSync(indexPath, 'utf8')); } catch {}
}
if (!Array.isArray(index.adapters)) index.adapters = [];
index.adapters = index.adapters.filter(a => (a.id || a.name) !== `${name}-synth`);
index.adapters.push({ id: `${name}-synth`, kind: name });
writeFileSync(indexPath, JSON.stringify(index, null, 2));
console.log(`✅ added ${name}-synth to ${indexPath}`);
