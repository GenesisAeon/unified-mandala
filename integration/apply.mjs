#!/usr/bin/env node
import { cpSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packDir = join(__dirname, 'pack');
const destDir = join(__dirname, '..');

function copy(src, dest) {
  const info = statSync(src);
  if (info.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) {
      copy(join(src, entry), join(dest, entry));
    }
  } else {
    if (!existsSync(dest)) {
      cpSync(src, dest);
    }
  }
}

if (!existsSync(packDir)) {
  console.error(`integration pack directory not found: ${packDir}`);
  process.exit(1);
}

for (const entry of readdirSync(packDir)) {
  if (entry.startsWith('.')) continue;
  copy(join(packDir, entry), join(destDir, entry));
}

console.log('Integration pack applied.');
