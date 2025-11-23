#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const sigilAjv = new Ajv({
  allErrors: true,
  strict: true,
  strictRequired: false,
  allowUnionTypes: true,
});
addFormats(sigilAjv);

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
let sigilValidator;

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

function loadSigilValidator(schemaPath) {
  if (sigilValidator) {
    return sigilValidator;
  }
  const absolute = path.join(projectRoot, schemaPath);
  const schema = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  sigilValidator = sigilAjv.compile(schema);
  return sigilValidator;
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

function verifyFingerprint(schemaPath, fingerprintPath) {
  const absoluteSchema = path.join(projectRoot, schemaPath);
  const absoluteFingerprint = path.join(projectRoot, fingerprintPath);
  if (!fs.existsSync(absoluteFingerprint)) {
    hasFailure = true;
    console.error(`❌ Missing fingerprint file: ${fingerprintPath}`);
    return;
  }
  const schemaContents = fs.readFileSync(absoluteSchema, 'utf8');
  const canonical = JSON.stringify(JSON.parse(schemaContents));
  const currentHash = createHash('sha256').update(canonical).digest('hex');
  const recordedHash = fs.readFileSync(absoluteFingerprint, 'utf8').trim();
  if (currentHash !== recordedHash) {
    hasFailure = true;
    console.error('❌ SigilMessage schema fingerprint mismatch.');
    console.error('   Schema changed. Bump schemaVersion and update fingerprint.');
  } else {
    console.log(`✅ Fingerprint matches for ${schemaPath}`);
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

const cosmicSigill = 'sigils/demos/cosmic-web.sigill.json';
const cosmicSigillPath = path.join(projectRoot, cosmicSigill);
if (fs.existsSync(cosmicSigillPath)) {
  validateDocument('schemas/sigillin-demo.schema.json', cosmicSigill, readJson);
} else {
  console.warn(`⚠️ Optional demo sigillin missing: ${cosmicSigill}`);
}

const sigilMessageSchema = 'schemas/sigil-message/1-0-0.schema.json';
const sigilFingerprint = 'schemas/sigil-message/.fingerprint';
verifyFingerprint(sigilMessageSchema, sigilFingerprint);

const sigilValidFixtures = [
  'sigils/samples/sigil-message.sample.json',
  'schemas/sigil-message/examples/valid.json',
];

for (const fixture of sigilValidFixtures) {
  const absolute = path.join(projectRoot, fixture);
  if (fs.existsSync(absolute)) {
    const validate = loadSigilValidator(sigilMessageSchema);
    const data = readJson(fixture);
    if (validate(data)) {
      console.log(`✅ ${fixture} conforms to ${sigilMessageSchema}`);
    } else {
      hasFailure = true;
      console.error(`❌ ${fixture} failed validation against ${sigilMessageSchema}`);
      for (const err of validate.errors ?? []) {
        console.error(`  • ${err.instancePath || '<root>'} ${err.message}`);
      }
    }
  } else {
    console.warn(`⚠️ Optional SigilMessage fixture missing: ${fixture}`);
  }
}

const sigilInvalidFixtures = [
  'schemas/sigil-message/examples/invalid-extra-prop.json',
  'schemas/sigil-message/examples/invalid-ascii-missing.json',
  'schemas/sigil-message/examples/invalid-ts.json',
];

for (const fixture of sigilInvalidFixtures) {
  const absolute = path.join(projectRoot, fixture);
  if (fs.existsSync(absolute)) {
    const validate = loadSigilValidator(sigilMessageSchema);
    const data = readJson(fixture);
    if (validate(data)) {
      hasFailure = true;
      console.error(
        `❌ Expected ${fixture} to be rejected by ${sigilMessageSchema}, but validation passed.`,
      );
    } else {
      const [firstError] = validate.errors ?? [];
      const message = firstError
        ? `${firstError.instancePath || '<root>'} ${firstError.message}`
        : 'validation failed as expected';
      console.log(`✅ ${fixture} rejected by ${sigilMessageSchema} (${message})`);
    }
  } else {
    console.warn(`⚠️ Optional SigilMessage invalid fixture missing: ${fixture}`);
  }
}

if (hasFailure) {
  process.exitCode = 1;
} else {
  console.log('\nAll schema validations passed.');
}
