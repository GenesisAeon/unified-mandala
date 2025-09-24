#!/usr/bin/env node
import { execSync } from 'node:child_process';

const labels = [
  { name: 'source:human', color: '0E8A16', description: 'Human-authored code' },
  { name: 'source:human-docs', color: '1D76DB', description: 'Human-authored docs/metadata only' },
  { name: 'source:mandala-ai', color: 'FBCA04', description: 'Mandala AI automation' },
  { name: 'source:external-ai', color: 'D93F0B', description: 'External AI (e.g. Codex/GPT)' },
  {
    name: 'ci:extended',
    color: 'FBCA04',
    description: 'Request full CI including advisory suites (hard fail).',
  },
  {
    name: 'ci:advisory',
    color: '0E8A16',
    description: 'Run advisory governance suite (soft fail).',
  },
  { name: 'ci:runtime', color: '5319E7', description: 'Run runtime/NATS E2E lane.' },
  {
    name: 'run:repomap',
    color: '0366D6',
    description: 'Trigger repomap build/validate on this PR.',
  },
];

function sh(command) {
  return execSync(command, { stdio: 'inherit' });
}

try {
  sh('gh --version');
} catch (error) {
  console.error(
    'GitHub CLI (gh) is required. Install it and run `gh auth login` before executing this script.',
  );
  process.exit(1);
}

for (const label of labels) {
  const args = `"${label.name}" --color ${label.color} --description "${label.description}"`;
  try {
    sh(`gh label create ${args}`);
  } catch (error) {
    sh(`gh label edit ${args}`);
  }
}

console.log('✅ Labels ensured.');
