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

const tasks = [
  {
    schema: 'schemas/mandala-map.schema.json',
    target: 'MandalaMap.yaml',
    loader: readYaml,
  },
  {
    schema: 'schemas/mandala-map.schema.json',
    target: 'MandalaMap.json',
    loader: readJson,
  },
  {
    schema: 'schemas/codexfeedback.schema.json',
    target: 'codexfeedback.yaml',
    loader: readYaml,
  },
  {
    schema: 'schemas/codexfeedback.schema.json',
    target: 'codexfeedback.json',
    loader: readJson,
  },
];

let hasFailure = false;

for (const task of tasks) {
  const { schema, target, loader } = task;
  try {
    const validate = loadSchema(schema);
    const data = loader(target);
    const valid = validate(data);
    if (valid) {
      console.log(`✅ ${target} conforms to ${schema}`);
    } else {
      hasFailure = true;
      console.error(`❌ ${target} failed validation against ${schema}`);
      for (const err of validate.errors ?? []) {
        console.error(`  • ${err.instancePath || '<root>'} ${err.message}`);
      }
    }
  } catch (error) {
    hasFailure = true;
    console.error(`❌ Error validating ${target} against ${schema}`);
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (hasFailure) {
  process.exitCode = 1;
} else {
  console.log('\nAll schema validations passed.');
}
