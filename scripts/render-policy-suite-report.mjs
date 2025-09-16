#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'out', 'policy');
fs.mkdirSync(outputDir, { recursive: true });

const jsonPath = process.env.POLICY_SUITE_JSON
  ? path.resolve(projectRoot, process.env.POLICY_SUITE_JSON)
  : path.join(outputDir, 'policy-suite.json');

let payload = { generatedAt: new Date().toISOString(), results: [] };
if (fs.existsSync(jsonPath)) {
  try {
    payload = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  } catch (error) {
    console.warn('Failed to read existing policy suite JSON, starting fresh', error);
  }
}

const results = Array.isArray(payload.results) ? [...payload.results] : [];

function upsertResult(entry) {
  const index = results.findIndex((item) => item.name === entry.name);
  if (index >= 0) {
    results[index] = { ...results[index], ...entry };
  } else {
    results.push(entry);
  }
}

function mapStatus(conclusion) {
  const value = (conclusion || '').toLowerCase();
  switch (value) {
    case 'success':
      return 'passed';
    case 'failure':
    case 'failed':
      return 'failed';
    case 'cancelled':
    case 'skipped':
      return 'skipped';
    default:
      return value ? value : 'skipped';
  }
}

const kyvernoConclusion = process.env.KYVERNO_CONCLUSION || process.env.KYVERNO_OUTCOME || '';
const kyvernoStatus = mapStatus(kyvernoConclusion);
const kyvernoNotes = process.env.KYVERNO_NOTES || 'See workflow logs for Kyverno output.';

upsertResult({
  name: 'Kyverno Dry-Run',
  status: kyvernoStatus,
  logPath: null,
  notes:
    kyvernoStatus === 'skipped'
      ? `${kyvernoNotes} (Kyverno action marked as skipped)`
      : kyvernoStatus === 'failed'
        ? `${kyvernoNotes} (Kyverno action conclusion: ${kyvernoConclusion || 'failure'})`
        : kyvernoNotes,
});

payload = {
  ...payload,
  generatedAt: payload.generatedAt || new Date().toISOString(),
  results,
};

function statusBadge(status) {
  switch (status) {
    case 'passed':
      return '✅ Passed';
    case 'failed':
      return '❌ Failed';
    case 'skipped':
      return '⚠️ Skipped';
    default:
      return `⚠️ ${status}`;
  }
}

function detailCell(entry) {
  const parts = [];
  if (entry.notes) {
    parts.push(entry.notes);
  }
  if (entry.logPath) {
    parts.push(`Log: ${entry.logPath}`);
  }
  if (parts.length === 0) {
    parts.push('—');
  }
  return parts.join('<br/>');
}

const lines = [
  '## Policy Suite Summary',
  '',
  '| Check | Status | Details |',
  '| --- | --- | --- |',
];
for (const entry of results) {
  lines.push(`| ${entry.name} | ${statusBadge(entry.status)} | ${detailCell(entry)} |`);
}

const summaryMarkdown = `${lines.join('\n')}\n`;
const reportPath = path.join(outputDir, 'policy-suite-report.md');
fs.writeFileSync(reportPath, summaryMarkdown);
fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));

const statusPath = path.join(outputDir, 'policy-suite-status.txt');
const hasFailure = results.some((entry) => entry.status === 'failed');
fs.writeFileSync(statusPath, `${hasFailure ? 'failed' : 'passed'}\n`);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summaryMarkdown}\n`);
}

console.log(summaryMarkdown);
