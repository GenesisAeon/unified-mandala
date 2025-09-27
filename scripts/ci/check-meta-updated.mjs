#!/usr/bin/env node
// Gentle reminder to update key meta artifacts (does not fail commit).
import { execSync } from 'node:child_process';

const targets = [
  'codexfeedback.md',
  'codexfeedback.json',
  'codexfeedback.yaml',
  'docs/roadmap/v1.0-stabilization-playbook.md',
  'docs/roadmap/v1.0-stabilization-playbook.yaml',
  'MandalaMap.md',
  'MandalaMap.json',
  'MandalaMap.yaml',
];

function getStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .split(/\r?\n/)
      .filter(Boolean);
    return new Set(out);
  } catch {
    return new Set();
  }
}

const staged = getStagedFiles();
const missing = targets.filter((t) => !staged.has(t));

if (missing.length > 0) {
  // Non-blocking reminder only
  console.log('[meta:check] Hinweis: Die folgenden Meta-Dateien sind nicht im Commit enthalten:');
  for (const m of missing) console.log(`  - ${m}`);
  console.log(
    '[meta:check] Bitte prüfen, ob Updates in codexfeedback, Roadmap, MandalaMap und Fraktal-Tagebuch nötig sind.',
  );
}
