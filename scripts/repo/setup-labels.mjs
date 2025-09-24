#!/usr/bin/env node
import { execSync } from 'node:child_process';

const labels = [
  { name: 'source:human', color: '0E8A16', description: 'Human-authored code' },
  {
    name: 'source:human-docs',
    color: '1D76DB',
    description: 'Human-authored docs and analysis only',
  },
  {
    name: 'source:mandala-ai',
    color: 'FBCA04',
    description: 'Mandala automation (AI workspaces, scratch/data)',
  },
  {
    name: 'source:external-ai',
    color: 'D93F0B',
    description: 'External AI (Codex/GPT). Docs/scratch only.',
  },
  { name: 'ci:extended', color: 'FBCA04', description: 'Run extended CI (hard fail).' },
  { name: 'ci:advisory', color: '0E8A16', description: 'Run advisory (soft fail) CI suite.' },
  { name: 'ci:runtime', color: '5319E7', description: 'Run runtime/NATS E2E checks.' },
  {
    name: 'run:repomap',
    color: '0366D6',
    description: 'Trigger repomap build/validate on this PR.',
  },
];

function run(command) {
  execSync(command, { stdio: 'inherit' });
}

try {
  run('gh --version');
} catch (error) {
  console.error('❌ GitHub CLI (gh) nicht gefunden. Bitte `gh auth login` ausführen.');
  process.exit(1);
}

for (const { name, color, description } of labels) {
  try {
    run(`gh label create "${name}" --color ${color} --description "${description}"`);
  } catch (error) {
    run(`gh label edit "${name}" --color ${color} --description "${description}"`);
  }
}

console.log('✅ Provenance- und CI-Labels sind angelegt/aktualisiert.');
