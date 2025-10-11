import { interAdapterResonance } from '../src/utils/resonance';
import path from 'node:path';
import fs from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const indexPath = path.join(root, 'out', 'sigillin_index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
// minimal demo use…
console.log(interAdapterResonance(0.86, 0.91).toFixed(3));
