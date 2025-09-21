#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const agentsFile = join(scriptDir, '../AGENTS.md');
const docsDir = join(scriptDir, '../docs/agents');

export function extractAgents() {
  const text = readFileSync(agentsFile, 'utf8');
  return text
    .split(/\r?\n/)
    .filter((line) => line.includes('Agent:'))
    .map((line) => line.split('Agent:')[1].trim())
    .filter(Boolean);
}

export function ensureDocs(agent) {
  const file = join(docsDir, `${agent}.md`);
  if (!existsSync(file)) {
    const content = `# ${agent}\n\nDokumentation in Arbeit.`;
    writeFileSync(file, content);
    console.log(`Created ${file}`);
  }
}

export function run() {
  if (!existsSync(docsDir)) {
    mkdirSync(docsDir, { recursive: true });
  }
  extractAgents().forEach(ensureDocs);
}

const invokedFromCli =
  typeof process.argv[1] === 'string' &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (invokedFromCli) {
  run();
}
