#!/usr/bin/env node
// Executes `bin/opa test --coverage --format=json` and feeds the result to the
// coverage parser while preserving the original opa exit code.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const opaBin = path.resolve(repoRoot, 'bin', 'opa');
const defaultPolicyDir = path.resolve(repoRoot, 'apps', 'ethics-api', 'opa');
const policyDir = process.env.OPA_POLICY_DIR
  ? path.resolve(repoRoot, process.env.OPA_POLICY_DIR)
  : defaultPolicyDir;
const outDir = path.resolve(repoRoot, 'dist', 'opa');
const coverageFile = path.join(outDir, 'coverage.json');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    min: process.env.OPA_MIN_COVERAGE ?? '0.85',
    top: process.env.OPA_COVERAGE_REPORT_COUNT ?? '5',
  };

  for (let i = 0; i < args.length; i++) {
    const token = args[i];
    if (token === '--min' && args[i + 1]) {
      options.min = args[++i];
      continue;
    }
    if (token === '--top' && args[i + 1]) {
      options.top = args[++i];
      continue;
    }
  }

  return options;
}

function ensureOutDir() {
  fs.mkdirSync(outDir, { recursive: true });
}

function runOpa(policyPath) {
  return spawn(opaBin, ['test', '--coverage', '--format=json', policyPath], {
    stdio: ['ignore', 'pipe', 'inherit'],
  });
}

function runParser(opts) {
  const node = process.execPath;
  const parserPath = path.resolve(__dirname, 'coverage.mjs');
  const parserArgs = ['--file', coverageFile, '--min', String(opts.min), '--top', String(opts.top)];
  return spawn(node, [parserPath, ...parserArgs], { stdio: 'inherit' });
}

async function main() {
  ensureOutDir();
  const opts = parseArgs();

  let opaOutput = '';
  const opaProc = runOpa(policyDir);

  opaProc.stdout.on('data', (chunk) => {
    opaOutput += chunk.toString();
  });

  opaProc.on('error', (error) => {
    console.error(`OPA_TEST_ERROR: ${error?.message ?? error}`);
    process.exit(1);
  });

  opaProc.on('close', (opaCode) => {
    try {
      fs.writeFileSync(coverageFile, opaOutput);
    } catch (error) {
      console.error(`OPA_COVERAGE_WRITE_FAILED: ${error?.message ?? error}`);
      process.exit(1);
      return;
    }

    const parserProc = runParser(opts);
    parserProc.on('close', (parserCode) => {
      const finalCode = opaCode !== 0 ? (opaCode ?? 1) : (parserCode ?? 0);
      process.exit(finalCode);
    });
  });
}

main().catch((error) => {
  console.error(`OPA_COVERAGE_UNEXPECTED_ERROR: ${error?.message ?? error}`);
  process.exit(1);
});
