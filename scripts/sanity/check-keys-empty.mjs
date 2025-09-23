#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const keysDir = path.join(projectRoot, 'keys');
const allowed = new Set(['.gitkeep', '.gitignore']);

if (!fs.existsSync(keysDir)) {
  console.log('[sanity] keys/ missing → OK (treated as empty)');
  process.exit(0);
}

const entries = fs.readdirSync(keysDir);
const offenders = entries.filter((entry) => !allowed.has(entry));

if (offenders.length > 0) {
  console.error(`[sanity] keys/ must be empty; unexpected: ${offenders.join(', ')}`);
  process.exit(1);
}

console.log('[sanity] keys/ empty OK');
