#!/usr/bin/env node
// Detects staged Sigillin bridge files and runs the validator against
// the changed subset. Intended for Git hooks and local QA workflows so
// we do not have to lint the entire catalogue on every commit.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import process from 'node:process';

import { validatePatterns } from './lib/sigillin-validator.mjs';

const execFileAsync = promisify(execFile);
const PATH_FILTER = /^(sigils\/.*\.(?:json|ya?ml)|docs\/sigillin\/.*\.md)$/i;

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

async function getStagedFiles() {
  try {
    const { stdout } = await execFileAsync('git', [
      'diff',
      '--cached',
      '--name-only',
      '--diff-filter=ACMR',
    ]);
    return stdout
      .split('\n')
      .map((entry) => entry.trim())
      .filter(Boolean);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error('Git executable nicht gefunden – bitte in einem Git-Repository ausführen.');
    }
    throw new Error(`git diff --cached fehlgeschlagen: ${(error && error.message) || error}`);
  }
}

function filterSigillinFiles(paths) {
  return paths.filter((candidate) => PATH_FILTER.test(candidate));
}

async function main() {
  const args = process.argv.slice(2);
  const inputPaths = args.length ? args : await getStagedFiles();
  const candidates = filterSigillinFiles(inputPaths);

  if (!candidates.length) {
    console.log('ℹ️  Keine geänderten Sigillin-Dateien gefunden.');
    return;
  }

  const { results, hasErrors } = await validatePatterns(candidates, {
    cwd: process.cwd(),
  });

  for (const result of results) {
    logResult(result);
  }

  if (hasErrors) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('validate-sigillins:changed failed:', error);
  process.exit(1);
});
