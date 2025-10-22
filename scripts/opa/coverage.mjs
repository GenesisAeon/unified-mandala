#!/usr/bin/env node
/**
 * OPA coverage gate (fail-closed).
 * - parses JSON from `opa test --coverage --format=json`
 * - expects data under `coverage.files`
 * - exits non-zero if coverage is missing or below threshold
 *
 * Usage:
 *   opa test --coverage --format=json ./apps/ethics-api/opa | node scripts/opa/coverage.mjs --min 0.85
 *   node scripts/opa/coverage.mjs --file dist/opa/coverage.json --min 0.9
 */
import fs from 'node:fs';
import { argv, exit } from 'node:process';

function parseArgs(a = argv.slice(2)) {
  const out = {
    min: Number(process.env.OPA_MIN_COVERAGE ?? '0.8'),
    file: null,
    top: Number(process.env.OPA_COVERAGE_REPORT_COUNT ?? '0'),
  };
  for (let i = 0; i < a.length; i++) {
    const t = a[i];
    if (t === '--min' && a[i + 1]) {
      out.min = Number(a[++i]);
      continue;
    }
    if ((t === '--file' || t === '-f') && a[i + 1]) {
      out.file = a[++i];
      continue;
    }
    if (t === '--top' && a[i + 1]) {
      out.top = Number(a[++i]);
      continue;
    }
    if (t === '--help' || t === '-h') {
      console.log('Usage: coverage.mjs [--min 0.85] [--file path|-] [--top N]');
      exit(0);
    }
  }
  if (!Number.isFinite(out.min) || out.min <= 0 || out.min > 1) {
    console.error(`ERR: --min must be (0,1], got ${out.min}`);
    exit(2);
  }
  return out;
}

async function readJsonFrom(file) {
  if (file && file !== '-') return JSON.parse(fs.readFileSync(file, 'utf8'));
  // stdin
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  const buf = Buffer.concat(chunks.map((c) => (Buffer.isBuffer(c) ? c : Buffer.from(c))));
  if (!buf.length) {
    console.error('ERR: no input provided to coverage gate (stdin empty and no --file)');
    exit(2);
  }
  return JSON.parse(buf.toString('utf8'));
}

function getCoverageFiles(report) {
  // Expected structure: { coverage: { files: { "<path>": { covered:[], not_covered:[] } } } }
  const cov = report && report.coverage;
  const files = cov && cov.files;
  if (!files || typeof files !== 'object' || !Object.keys(files).length) {
    throw new Error('COVERAGE_MISSING');
  }
  return files;
}

function compute(files) {
  let covered = 0;
  let total = 0;
  const perFile = [];
  for (const [name, fileReport] of Object.entries(files)) {
    const c = Array.isArray(fileReport.covered) ? fileReport.covered.length : 0;
    const n = Array.isArray(fileReport.not_covered) ? fileReport.not_covered.length : 0;
    covered += c;
    total += c + n;
    perFile.push({ name, covered: c, notCovered: n, total: c + n, pct: c + n ? c / (c + n) : 1 });
  }
  if (total === 0) {
    throw new Error('COVERAGE_ZERO_LINES');
  }
  return { covered, total, pct: covered / total, perFile };
}

function formatPct(p) {
  return `${(p * 100).toFixed(2)}%`;
}

async function main() {
  const args = parseArgs();
  let report;
  try {
    report = await readJsonFrom(args.file);
  } catch (e) {
    console.error('ERR: failed to parse coverage JSON:', e?.message || e);
    exit(2);
  }
  let files;
  try {
    files = getCoverageFiles(report);
  } catch (e) {
    if (e?.message === 'COVERAGE_MISSING') {
      console.error(
        'ERR: report.coverage.files missing/empty – did you run `opa test --coverage --format=json`?',
      );
    } else {
      console.error('ERR:', e?.message || e);
    }
    exit(2);
  }
  let result;
  try {
    result = compute(files);
  } catch (e) {
    if (e?.message === 'COVERAGE_ZERO_LINES') {
      console.error('ERR: no measurable lines found – refusing to assume 100% coverage.');
    } else {
      console.error('ERR:', e?.message || e);
    }
    exit(2);
  }

  const pct = result.pct;
  console.log(
    `OPA coverage: ${formatPct(pct)} (${result.covered}/${result.total})  threshold: ${formatPct(args.min)}`,
  );
  if (args.top > 0) {
    const worst = [...result.perFile].sort((a, b) => a.pct - b.pct).slice(0, args.top);
    for (const f of worst) {
      console.log(
        `  - ${f.name}: ${formatPct(f.pct)} (${f.covered}/${f.total})  not-covered=${f.notCovered}`,
      );
    }
  }
  if (pct + 1e-12 < args.min) {
    console.error('FAIL: OPA coverage below threshold.');
    exit(1);
  }
}

main().catch((e) => {
  console.error('ERR: unexpected coverage gate failure:', e?.message || e);
  exit(2);
});
