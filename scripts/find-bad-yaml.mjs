#!/usr/bin/env node
import process from 'node:process';
import fg from 'fast-glob';
import { lintFile } from 'yaml-lint';

const TARGET_PATTERNS = ['sigils/**/*.y?(a)ml', 'docs/sigillin/**/*.y?(a)ml'];

async function main() {
  const files = await fg(TARGET_PATTERNS, {
    cwd: process.cwd(),
    onlyFiles: true,
    unique: true,
  });

  if (files.length === 0) {
    console.log('[find-bad-yaml] No YAML files matched targeted patterns.');
    return;
  }

  const failures = [];

  for (const file of files) {
    try {
      await lintFile(file);
    } catch (error) {
      failures.push({ file, error });
      console.error(`❌ ${file}`);
      if (error instanceof Error) {
        console.error(`   ${error.message}`);
      } else {
        console.error('   Unknown error.');
      }
    }
  }

  if (failures.length > 0) {
    console.error(`[find-bad-yaml] ${failures.length} file(s) failed YAML linting.`);
    process.exit(1);
  }

  console.log(`[find-bad-yaml] ${files.length} file(s) linted successfully.`);
}

main().catch((error) => {
  console.error('[find-bad-yaml] Unexpected error:', error);
  process.exit(1);
});
