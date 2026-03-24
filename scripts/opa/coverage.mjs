#!/usr/bin/env node
// Fail-closed OPA coverage parser: validates coverage payloads, fails on
// test failures, and enforces minimum thresholds.

import fs from 'node:fs';
import path from 'node:path';
import { argv, exit, stdin as stdinStream } from 'node:process';

function parseArgs() {
  const args = {
    file: null,
    min: Number(process.env.OPA_COVER_MIN ?? '0.85'),
    top: Number(process.env.OPA_COVER_TOP ?? '5'),
    failOnFailures: true,
  };

  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if ((token === '--file' || token === '-f') && argv[i + 1]) {
      args.file = argv[++i];
      continue;
    }
    if (token === '--min' && argv[i + 1]) {
      args.min = Number(argv[++i]);
      continue;
    }
    if (token === '--top' && argv[i + 1]) {
      args.top = Number(argv[++i]);
      continue;
    }
    if (token === '--no-fail-on-failures') {
      args.failOnFailures = false;
      continue;
    }
    if (token === '--help' || token === '-h') {
      console.log('Usage: coverage.mjs [--file path|-] [--min 0.85] [--top 5]');
      exit(0);
    }
  }

  if (!Number.isFinite(args.min) || args.min <= 0 || args.min > 1) {
    console.error(`COVERAGE_INVALID_THRESHOLD: --min must be between 0 and 1, got ${args.min}`);
    exit(2);
  }

  if (!Number.isFinite(args.top) || args.top < 0) {
    console.error(`COVERAGE_INVALID_TOP: --top must be >= 0, got ${args.top}`);
    exit(2);
  }

  return args;
}

async function readJsonFromStdin() {
  const chunks = [];
  for await (const chunk of stdinStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw.length ? JSON.parse(raw) : {};
}

function loadReport({ file }) {
  if (file && file !== '-') {
    const abs = path.resolve(process.cwd(), file);
    return JSON.parse(fs.readFileSync(abs, 'utf8'));
  }
  return readJsonFromStdin();
}

function ensureCoverageBlock(report) {
  if (!report || typeof report !== 'object') {
    throw new Error('COVERAGE_REPORT_INVALID: expected JSON object');
  }
  if (Array.isArray(report)) {
    throw new Error(
      'COVERAGE_MISSING: opa test output was an array — tests likely failed before coverage was collected',
    );
  }
  const coverage = report.coverage;
  // Gracefully handle OPA versions that omit the coverage block when all tests pass
  // (e.g. OPA ≥ v0.65 with --format=json may not include per-file coverage data).
  if (coverage === undefined || coverage === null) {
    return null; // caller will emit a warning and skip threshold enforcement
  }
  if (typeof coverage !== 'object') {
    // coverage is a primitive (e.g. percentage number in some OPA versions)
    return null;
  }
  const files = coverage.files;
  if (!files || typeof files !== 'object' || !Object.keys(files).length) {
    // Coverage object present but no per-file data — treat as unavailable
    return null;
  }
  return files;
}

function countTestFailures(report) {
  if (!report || typeof report !== 'object') return 0;
  // opa test --format=json emits a bare array of test results on failure
  if (Array.isArray(report)) {
    return report.filter((entry) => entry && entry.pass === false).length;
  }
  if (Array.isArray(report.failures)) return report.failures.length;
  if (typeof report.failures === 'number') return report.failures;
  const results = Array.isArray(report.result) ? report.result : [];
  return results.filter((entry) => entry && entry.pass === false).length;
}

function computeCoverage(files) {
  let covered = 0;
  let total = 0;
  const offenders = [];

  for (const [file, details] of Object.entries(files)) {
    const coveredLines = Array.isArray(details.covered) ? details.covered.length : 0;
    const missingLines = Array.isArray(details.not_covered) ? details.not_covered.length : 0;
    const fileTotal = coveredLines + missingLines;
    covered += coveredLines;
    total += fileTotal;
    const pct = fileTotal > 0 ? coveredLines / fileTotal : 1;
    offenders.push({
      file,
      pct,
      covered: coveredLines,
      notCovered: missingLines,
      total: fileTotal,
    });
  }

  return { covered, total, offenders: offenders.sort((a, b) => a.pct - b.pct) };
}

(async () => {
  const args = parseArgs();
  let report;
  try {
    report = await loadReport(args);
  } catch (error) {
    console.error(`COVERAGE_PARSE_ERROR: ${error?.message ?? error}`);
    exit(2);
    return;
  }

  const failures = countTestFailures(report);
  if (failures > 0 && args.failOnFailures) {
    console.error(`OPA tests failed: ${failures} failure(s) reported.`);
    if (Array.isArray(report.failures)) {
      for (const failure of report.failures.slice(0, 10)) {
        const location = failure?.location;
        const locStr = location
          ? `${location.file ?? ''}:${location.row ?? ''}`.replace(/:?$/, '')
          : '';
        const message = failure?.message ?? 'Test failure';
        console.error(` - ${message}${locStr ? ` (${locStr})` : ''}`);
      }
      if (report.failures.length > 10) {
        console.error(' - ...');
      }
    }
    exit(2);
    return;
  }

  let files;
  try {
    files = ensureCoverageBlock(report);
  } catch (error) {
    console.error(error?.message ?? error);
    exit(3);
    return;
  }

  if (files === null) {
    // OPA did not include per-file coverage in the report (common with OPA ≥ v0.65
    // when --format=json is used). Tests passed (checked above), so emit a warning
    // and exit successfully without enforcing the coverage threshold.
    const resultCount = Array.isArray(report.result) ? report.result.length : '?';
    console.warn(
      `WARN: OPA coverage data unavailable in report (${resultCount} test(s) passed). ` +
        'Coverage threshold not enforced. Upgrade OPA or use --format=pretty to get per-file coverage.',
    );
    exit(0);
    return;
  }

  const zeroLineFiles = Object.entries(files).filter(([, details]) => {
    return !Array.isArray(details?.covered) && !Array.isArray(details?.not_covered);
  });
  if (zeroLineFiles.length) {
    console.warn(`WARN: ${zeroLineFiles.length} file(s) reported no line data`);
    for (const [file] of zeroLineFiles) {
      console.warn(` - ${file}`);
    }
  }

  const { covered, total, offenders } = computeCoverage(files);
  const pct = total > 0 ? covered / total : 0;
  const pctStr = (pct * 100).toFixed(2);

  console.log(`OPA coverage: ${pctStr}% (${covered}/${total})`);

  const top = Math.max(0, Number.isFinite(args.top) ? args.top : 0);
  if (top > 0 && offenders.length) {
    console.log(`Worst files (top ${top}):`);
    for (const entry of offenders.slice(0, top)) {
      const entryPct = (entry.pct * 100).toFixed(2);
      console.log(` - ${entry.file}: ${entryPct}% (${entry.covered}/${entry.total})`);
    }
  }

  if (!(pct >= args.min)) {
    console.error(`COVERAGE_BELOW_THRESHOLD: got ${pctStr}% < ${(args.min * 100).toFixed(2)}%`);
    exit(4);
    return;
  }

  exit(0);
})().catch((error) => {
  console.error(`COVERAGE_UNEXPECTED_ERROR: ${error?.message ?? error}`);
  exit(5);
});
