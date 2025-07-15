#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export function parseCREP(poem: string): string {
  const match = poem.match(/CREP-Strahl:\s*([0-9.,\s]+)/);
  return match ? match[1].trim() : '';
}

export function run() {
  const root = path.resolve(__dirname, '..');
  execSync(`node ${path.join(__dirname, 'generate-chronopoem.js')}`, { stdio: 'inherit' });
  const content = fs.readFileSync(path.join(root, 'CHRONOPOEM.md'), 'utf8');
  const crep = parseCREP(content) || 'unknown';
  execSync('git add CHRONOPOEM.md');
  const msg = `chore(chronopoem): update CREP ${crep}`;
  execSync(`git commit -m "${msg}"`);
  console.log(msg);
  return msg;
}

if (require.main === module) {
  run();
}
