#!/usr/bin/env ts-node
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

type Choice = { id: string; diff: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; tests: string[] };

function load(p: string) {
  return readFileSync(p, 'utf8');
}

function loadFirstExisting(paths: string[], fallback: string) {
  for (const candidate of paths) {
    if (existsSync(candidate)) {
      return readFileSync(candidate, 'utf8');
    }
  }
  console.warn(
    `[emergence-scan] None of ${paths.join(', ')} found. Using fallback placeholder content.`,
  );
  return fallback;
}

const inputs = {
  index: load('out/sigillin_index.json'),
  errs: (() => {
    try {
      return load('out/sigils_errors.json');
    } catch {
      return '[]';
    }
  })(),
  docs: loadFirstExisting(
    ['SIGILLIN_GENESIS.md', path.join('docs', 'sigillin', 'GENESIS.md')],
    '# SIGILLIN GENESIS\n\nPlaceholder genesis record. Populate SIGILLIN_GENESIS.md in the repo root or docs/sigillin/GENESIS.md for full context.\n',
  ),
};

// In your runtime, call the Archivist model here.
// For now we scaffold a stub that reads prompts and writes a TODO patch file.
const prompt = [
  load('prompts/emergence-scan.md'),
  '\n\n# Artifacts\n',
  '## sigillin_index.json\n',
  inputs.index.slice(0, 8000),
  '\n## sigils_errors.json\n',
  inputs.errs.slice(0, 4000),
].join('');

writeFileSync('out/agent_archivist_input.txt', prompt);
console.log('✍️  Wrote prompt to out/agent_archivist_input.txt');
// A real run would POST `prompt` to your model endpoint and write diffs into out/archivist_patches.md
