#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = [
  'node_modules/.vite',
  'coverage',
  '.eslintcache',
  'tmp',
  'analysis/repo-map.json',
  'analysis/repo-map.csv',
  'analysis/mandala-map-summary.json',
];

function rm(target) {
  const p = path.join(root, target);
  if (!fs.existsSync(p)) return;
  const stat = fs.statSync(p);
  try {
    if (stat.isDirectory()) {
      fs.rmSync(p, { recursive: true, force: true });
    } else {
      fs.unlinkSync(p);
    }
    console.log(`[clean] removed ${target}`);
  } catch (err) {
    console.warn(`[clean] failed to remove ${target}:`, err.message);
  }
}

for (const t of targets) rm(t);
console.log('[clean] cache cleanup complete');
