#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const OPA_BIN_DEFAULT = process.platform === 'win32' ? 'opa.exe' : 'opa';
const LOCAL_OPA = path.join(ROOT, 'bin', OPA_BIN_DEFAULT);
const OPA = process.env.OPA_BIN || (existsSync(LOCAL_OPA) ? LOCAL_OPA : OPA_BIN_DEFAULT);
const OPA_DIR = path.join(ROOT, 'apps', 'ethics-api', 'opa');
const THRESHOLD = Number(process.env.OPA_COVERAGE_MIN ?? '0.85');

const result = spawnSync(OPA, ['test', OPA_DIR, '--coverage', '--format=json'], {
  encoding: 'utf8',
  shell: process.platform === 'win32',
});

if ((result.status ?? 1) !== 0) {
  const output = result.stdout || result.stderr || 'OPA test command failed.';
  console.error(output.trim());
  process.exit(result.status ?? 1);
}

let report;
try {
  report = JSON.parse(result.stdout || '{}');
} catch (error) {
  console.error('Failed to parse OPA coverage JSON. Raw output:\n');
  console.error(result.stdout);
  process.exit(1);
}

const files = report?.files ?? {};
let covered = 0;
let total = 0;

for (const fileReport of Object.values(files)) {
  const coveredLines = Array.isArray(fileReport.covered) ? fileReport.covered.length : 0;
  const notCoveredLines = Array.isArray(fileReport.not_covered) ? fileReport.not_covered.length : 0;
  covered += coveredLines;
  total += coveredLines + notCoveredLines;
}

const percentage = total > 0 ? covered / total : 1;
const pctDisplay = (percentage * 100).toFixed(2);
const thresholdDisplay = (THRESHOLD * 100).toFixed(0);

console.log(`OPA coverage: ${pctDisplay}% (min ${thresholdDisplay}%)`);

if (!(percentage >= THRESHOLD)) {
  console.error('Coverage below threshold.');
  process.exit(2);
}
