#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const requiredFiles = [
  'MandalaMap.yaml',
  'MandalaMap.json',
  'docs/roadmap/v1.0-stabilization-playbook.yaml',
  'docs/roadmap/v1.0-stabilization-playbook.md',
  'analysis/trikaya-dashboard.yaml',
  'analysis/trikaya-dashboard.json',
  'codexfeedback.yaml',
  'codexfeedback.json',
];

const errors = [];

for (const relative of requiredFiles) {
  const absolute = path.join(projectRoot, relative);
  if (!fs.existsSync(absolute)) {
    errors.push(`Missing required artefact: ${relative}`);
  }
}

function assertCiBehaviour(source, doc) {
  if (!doc || typeof doc !== 'object') {
    errors.push(`${source}: document is empty or not an object.`);
    return;
  }
  const ci = doc.ciBehaviour;
  if (!ci || typeof ci !== 'object') {
    errors.push(`${source}: ciBehaviour block missing.`);
    return;
  }
  if (typeof ci.analyticsToggle !== 'boolean') {
    errors.push(`${source}: ciBehaviour.analyticsToggle must be a boolean.`);
  }
  if (!Array.isArray(ci.adapterBackends) || ci.adapterBackends.length === 0) {
    errors.push(`${source}: ciBehaviour.adapterBackends must be a non-empty array.`);
  }
}

try {
  const mandalaYaml = yaml.load(fs.readFileSync(path.join(projectRoot, 'MandalaMap.yaml'), 'utf8'));
  assertCiBehaviour('MandalaMap.yaml', mandalaYaml);
} catch (error) {
  errors.push(`MandalaMap.yaml: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const mandalaJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'MandalaMap.json'), 'utf8'),
  );
  assertCiBehaviour('MandalaMap.json', mandalaJson);
} catch (error) {
  errors.push(`MandalaMap.json: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const dashboard = yaml.load(
    fs.readFileSync(path.join(projectRoot, 'analysis', 'trikaya-dashboard.yaml'), 'utf8'),
  );
  assertCiBehaviour('analysis/trikaya-dashboard.yaml', dashboard);
} catch (error) {
  errors.push(
    `analysis/trikaya-dashboard.yaml: ${error instanceof Error ? error.message : String(error)}`,
  );
}

try {
  const codex = yaml.load(fs.readFileSync(path.join(projectRoot, 'codexfeedback.yaml'), 'utf8'));
  if (!codex || typeof codex !== 'object') {
    errors.push('codexfeedback.yaml: document invalid.');
  } else {
    if (!codex.hook || typeof codex.hook !== 'object') {
      errors.push('codexfeedback.yaml: hook section missing.');
    } else {
      if (typeof codex.hook.progress !== 'string' || codex.hook.progress.trim() === '') {
        errors.push('codexfeedback.yaml: hook.progress must be a non-empty string.');
      }
    }
  }
} catch (error) {
  errors.push(`codexfeedback.yaml: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  const codexJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'codexfeedback.json'), 'utf8'),
  );
  if (!Array.isArray(codexJson.runs)) {
    errors.push('codexfeedback.json: runs array missing.');
  } else {
    const latest = codexJson.runs[0];
    if (!latest || typeof latest !== 'object') {
      errors.push('codexfeedback.json: first run entry missing.');
    } else if (!/Fraktal65/.test(latest.fraktalrun || '')) {
      errors.push('codexfeedback.json: latest run should describe Fraktal65.');
    }
  }
} catch (error) {
  errors.push(`codexfeedback.json: ${error instanceof Error ? error.message : String(error)}`);
}

if (errors.length) {
  console.error('Repo sanity checks failed:');
  for (const err of errors) {
    console.error(` - ${err}`);
  }
  process.exitCode = 1;
} else {
  console.log('✅ Repo sanity checks passed.');
}
