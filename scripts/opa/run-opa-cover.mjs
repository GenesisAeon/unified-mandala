#!/usr/bin/env node
// Executes `bin/opa test --coverage --format=json` and feeds the result to the
// coverage parser while preserving the original opa exit code.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const opaBin = path.resolve(repoRoot, 'bin', 'opa');

function resolvePolicyDir() {
  const cliIdx = process.argv.indexOf('--policy');
  if (cliIdx >= 0 && process.argv[cliIdx + 1]) {
    return path.resolve(process.cwd(), process.argv[cliIdx + 1]);
  }
  if (process.env.OPA_POLICY_DIR) {
    const candidate = path.resolve(repoRoot, process.env.OPA_POLICY_DIR);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    return path.resolve(process.cwd(), process.env.OPA_POLICY_DIR);
  }
  const candidates = [
    path.resolve(repoRoot, 'apps', 'ethics-api', 'opa'),
    path.resolve(repoRoot, '..', 'apps', 'ethics-api', 'opa'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

const policyDir = resolvePolicyDir();
const outDir = path.resolve(repoRoot, 'dist', 'opa');
const coverageFile = path.join(outDir, 'coverage.json');

function pick(name, dflt) {
  const argIdx = process.argv.indexOf(`--${name}`);
  if (argIdx >= 0 && process.argv[argIdx + 1]) {
    return String(process.argv[argIdx + 1]);
  }
  const envKey = `OPA_COVER_${name.toUpperCase()}`;
  if (process.env[envKey]) {
    return String(process.env[envKey]);
  }
  return String(dflt);
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
  const opts = {
    min: pick('min', '0.85'),
    top: pick('top', '5'),
  };

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
    parserProc.on('error', (error) => {
      console.error(`OPA_COVERAGE_PARSE_ERROR: ${error?.message ?? error}`);
      process.exit(1);
    });
    parserProc.on('close', (parserCode) => {
      const finalCode = opaCode !== 0 ? (opaCode ?? 1) : (parserCode ?? 0);
      if (process.env.GITHUB_STEP_SUMMARY && fs.existsSync(coverageFile)) {
        try {
          const minNumber = Number(opts.min);
          const threshold = Number.isFinite(minNumber)
            ? `${(minNumber * 100).toFixed(2)}%`
            : String(opts.min);
          const summary = `### OPA Coverage\n- policy dir: \`${policyDir}\`\n- threshold: ${threshold}\n- report: \`dist/opa/coverage.json\`\n\n`;
          fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
        } catch (error) {
          console.warn(`OPA_SUMMARY_WRITE_FAILED: ${error?.message ?? error}`);
        }
      }
      process.exit(finalCode);
    });
  });
}

main().catch((error) => {
  console.error(`OPA_COVERAGE_UNEXPECTED_ERROR: ${error?.message ?? error}`);
  process.exit(1);
});
