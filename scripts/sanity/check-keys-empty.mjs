#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const keysDir = path.join(projectRoot, 'keys');
const allowed = new Set(['.gitkeep', '.gitignore']);

if (!fs.existsSync(keysDir)) {
  console.log('[sanity] keys/ missing → treated as empty');
  process.exit(0);
}

const entries = fs.readdirSync(keysDir, { withFileTypes: true });
const unexpected = entries
  .filter((entry) => entry.isFile() && !allowed.has(entry.name))
  .map((entry) => entry.name);

const forbiddenDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

if (unexpected.length > 0 || forbiddenDirs.length > 0) {
  if (unexpected.length > 0) {
    console.error(`[sanity] keys/ must be empty; unexpected files: ${unexpected.join(', ')}`);
  }
  if (forbiddenDirs.length > 0) {
    console.error(`[sanity] keys/ contains directories: ${forbiddenDirs.join(', ')}`);
  }
  process.exit(1);
}

console.log('[sanity] keys/ empty OK');
