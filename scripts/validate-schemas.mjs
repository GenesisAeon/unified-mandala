#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function readJson(relativePath) {
  const absolute = path.join(projectRoot, relativePath);
  const contents = fs.readFileSync(absolute, 'utf8');
  return JSON.parse(contents);
}

function readYaml(relativePath) {
  const absolute = path.join(projectRoot, relativePath);
  const contents = fs.readFileSync(absolute, 'utf8');
  return yaml.load(contents);
}

const schemaCache = new Map();

function loadSchema(relativePath) {
  if (schemaCache.has(relativePath)) {
    return schemaCache.get(relativePath);
  }
  const absolute = path.join(projectRoot, relativePath);
  const schema = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  const validator = ajv.compile(schema);
  schemaCache.set(relativePath, validator);
  return validator;
}

let hasFailure = false;
function validateDocument(schemaPath, targetPath, loader) {
  try {
    const validate = loadSchema(schemaPath);
    const data = loader(targetPath);
    if (validate(data)) {
      console.log(`✅ ${targetPath} conforms to ${schemaPath}`);
      return;
    }
    hasFailure = true;
    console.error(`❌ ${targetPath} failed validation against ${schemaPath}`);
    for (const err of validate.errors ?? []) {
      console.error(`  • ${err.instancePath || '<root>'} ${err.message}`);
    }
  } catch (error) {
    hasFailure = true;
    console.error(`❌ Error validating ${targetPath} against ${schemaPath}`);
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
  }
}

const mandalaTargets = [
  { path: 'MandalaMap.yaml', loader: readYaml },
  { path: 'MandalaMap.json', loader: readJson },
];

for (const target of mandalaTargets) {
  const absolute = path.join(projectRoot, target.path);
  if (!fs.existsSync(absolute)) {
    hasFailure = true;
    console.error(`❌ Missing MandalaMap artefact: ${target.path}`);
    continue;
  }
  validateDocument('schemas/mandala-map.schema.json', target.path, target.loader);
}

const codexCandidates = [
  { path: 'codexfeedback.yaml', loader: readYaml },
  { path: 'codexfeedback.yml', loader: readYaml },
  { path: 'codexfeedback.json', loader: readJson },
  { path: 'docs/codexfeedback.yaml', loader: readYaml },
  { path: 'docs/codexfeedback.yml', loader: readYaml },
  { path: 'docs/codexfeedback.json', loader: readJson },
];

const seenCodexTargets = codexCandidates.filter((candidate) =>
  fs.existsSync(path.join(projectRoot, candidate.path)),
);

if (seenCodexTargets.length === 0) {
  hasFailure = true;
  console.error('❌ No codexfeedback.(json|yaml) artefact found.');
} else {
  for (const candidate of seenCodexTargets) {
    validateDocument('schemas/codexfeedback.schema.json', candidate.path, candidate.loader);
  }
}

if (hasFailure) {
  process.exitCode = 1;
} else {
  console.log('\nAll schema validations passed.');
}
