#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const mustHaveAll = [
  'MandalaMap.yaml',
  'MandalaMap.json',
  'docs/roadmap/v1.0-stabilization-playbook.yaml',
  'docs/roadmap/v1.0-stabilization-playbook.md',
  'analysis/trikaya-dashboard.yaml',
];

const mustHaveAny = [['codexfeedback.yaml', 'codexfeedback.yml', 'codexfeedback.json']];

const errors = [];

for (const relative of mustHaveAll) {
  const absolute = path.join(projectRoot, relative);
  if (!fs.existsSync(absolute)) {
    errors.push(`Missing required artefact: ${relative}`);
  }
}

for (const group of mustHaveAny) {
  if (!group.some((candidate) => fs.existsSync(path.join(projectRoot, candidate)))) {
    errors.push(`Missing at least one codexfeedback artefact (${group.join(', ')})`);
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

const codexYamlCandidate = ['codexfeedback.yaml', 'codexfeedback.yml']
  .map((candidate) => ({ candidate, absolute: path.join(projectRoot, candidate) }))
  .find(({ absolute }) => fs.existsSync(absolute));

if (codexYamlCandidate) {
  try {
    const codex = yaml.load(fs.readFileSync(codexYamlCandidate.absolute, 'utf8'));
    if (!codex || typeof codex !== 'object') {
      errors.push(`${codexYamlCandidate.candidate}: document invalid.`);
    } else if (!codex.hook || typeof codex.hook !== 'object') {
      errors.push(`${codexYamlCandidate.candidate}: hook section missing.`);
    } else if (typeof codex.hook.progress !== 'string' || codex.hook.progress.trim() === '') {
      errors.push(`${codexYamlCandidate.candidate}: hook.progress must be a non-empty string.`);
    }
  } catch (error) {
    errors.push(
      `${codexYamlCandidate.candidate}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

const codexJsonPath = path.join(projectRoot, 'codexfeedback.json');
if (fs.existsSync(codexJsonPath)) {
  try {
    const codexJson = JSON.parse(fs.readFileSync(codexJsonPath, 'utf8'));
    if (!Array.isArray(codexJson.runs) || codexJson.runs.length === 0) {
      errors.push('codexfeedback.json: runs array missing or empty.');
    } else {
      const latest = codexJson.runs[0];
      if (!latest || typeof latest.fraktalrun !== 'string' || latest.fraktalrun.trim() === '') {
        errors.push('codexfeedback.json: first run requires a fraktalrun identifier.');
      }
    }
  } catch (error) {
    errors.push(`codexfeedback.json: ${error instanceof Error ? error.message : String(error)}`);
  }
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
