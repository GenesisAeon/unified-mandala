#!/usr/bin/env node
// CLI wrapper around the shared sigillin validator utilities.
// Keeps the original console output semantics while exposing the
// validation logic as a reusable module (`scripts/lib/sigillin-validator.mjs`).

import process from 'node:process';

import { DEFAULT_PATTERNS, validatePatterns } from './lib/sigillin-validator.mjs';

function logResult(result) {
  const rel = result.relativePath || result.filePath;
  if (result.skipped) {
    const suffix = result.skipReason ? ` (skip: ${result.skipReason})` : '';
    console.log(`⏭️  ${rel}${suffix}`);
    return;
  }
  if (result.errors && result.errors.length) {
    console.log(`❌ ${rel}`);
    for (const error of result.errors) {
      console.log(`   - ${error}`);
    }
    return;
  }
  console.log(`✅ ${rel}`);
}

async function main() {
  const args = process.argv.slice(2);
  const patterns = args.length ? args : DEFAULT_PATTERNS;
  const { results, hasErrors, matchedFiles, usedPatterns } = await validatePatterns(patterns, {
    cwd: process.cwd(),
  });

  if (!matchedFiles.length) {
    console.log('ℹ️  Keine Sigillin-Dateien gefunden (Patterns):', usedPatterns.join(', '));
    return;
  }

  for (const result of results) {
    logResult(result);
  }

  if (hasErrors) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Validator fatal:', error);
  process.exit(1);
});
