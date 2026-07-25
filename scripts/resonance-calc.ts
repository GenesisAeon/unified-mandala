import { interAdapterResonance } from '../src/utils/resonance/index.js';
import path from 'node:path';
import fs from 'node:fs';

// run-dist.mjs always spawns this compiled script with cwd = repo root, so
// process.cwd() is the reliable repo-root anchor here - import.meta.url
// pointed one directory too shallow once compiled into dist/scripts/, and
// its .pathname additionally breaks on Windows (leading slash before the
// drive letter turns "D:\..." into "D:\D:\...").
const indexPath = path.join(process.cwd(), 'out', 'sigillin_index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
// minimal demo use…
console.log(interAdapterResonance(0.86, 0.91).toFixed(3));
