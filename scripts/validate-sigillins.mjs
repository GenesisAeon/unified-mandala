// Node >=18, ESM. Cross-platform, keine Shell-Globs.
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';
import fg from 'fast-glob';
import Ajv from 'ajv';

const ROOT = process.cwd();
const SCHEMA_PATH = path.join(ROOT, 'scripts', 'schemas', 'mandala-sigillin.schema.json');

const CREP_KEYS = [
  'Coherence',
  'Resonance',
  'Emergence',
  'Poetics',
  'CREP',
  'Kohärenz',
  'Resonanz',
  'Emergenz',
  'Poetik',
];
const TRIKAYA_KEYS = [
  'Dharmakāya',
  'Sambhogakāya',
  'Nirmāṇakāya',
  'Trikāya',
  'Dharma',
  'Sambhoga',
  'Nirmāṇa',
];
const NEXT_KEYS = [
  'nächste Handlung',
  'nächste Schritte',
  'nächster Schritt',
  'next action',
  'next steps',
];

const DEFAULT_PATTERNS = [
  'sigils/**/*.json',
  'sigils/**/*.yaml',
  'sigils/**/*.yml',
  'docs/sigillin/**/*.md',
];

function includesAny(haystack, needles) {
  return needles.some((k) => haystack.includes(k));
}

async function readJson(p) {
  const s = await fs.readFile(p, 'utf8');
  return JSON.parse(s);
}
async function readYaml(p) {
  const s = await fs.readFile(p, 'utf8');
  return yaml.load(s);
}
async function readText(p) {
  return fs.readFile(p, 'utf8');
}

async function loadSchema() {
  const s = await fs.readFile(SCHEMA_PATH, 'utf8');
  return JSON.parse(s);
}

async function validateStructured(obj, ajvValidate) {
  const errors = [];
  const ok = ajvValidate(obj);
  if (!ok) {
    for (const e of ajvValidate.errors || []) {
      const loc = e.instancePath || e.dataPath || '';
      errors.push(`Schema: ${loc} ${e.message}`);
    }
  }
  const contentStr = JSON.stringify(obj);
  if (!includesAny(contentStr, CREP_KEYS)) errors.push('Content: CREP-Begriffe fehlen.');
  if (!includesAny(contentStr, TRIKAYA_KEYS)) errors.push('Content: Trikāya-Begriffe fehlen.');
  if (!includesAny(contentStr, NEXT_KEYS)) errors.push("Content: 'Nächste Schritte' fehlen.");

  const links = obj?.sigillin?.links || [];
  for (const link of links) {
    if (link.startsWith('aeon://')) continue; // virtuelle Links
    try {
      const maybePath = path.isAbsolute(link) ? link : path.join(ROOT, link);
      await fs.access(maybePath);
    } catch {
      errors.push(`Hint: Verlinkte Datei nicht gefunden (optional): ${link}`);
    }
  }
  return errors;
}

async function validateMarkdown(filepath) {
  const content = await readText(filepath);
  const errors = [];
  if (!includesAny(content, CREP_KEYS)) errors.push('MD: CREP-Begriffe fehlen.');
  if (!includesAny(content, TRIKAYA_KEYS)) errors.push('MD: Trikāya-Begriffe fehlen.');
  if (!includesAny(content, NEXT_KEYS)) errors.push("MD: 'Nächste Schritte' fehlen.");
  return errors;
}

async function main() {
  const schema = await loadSchema();
  const ajv = new Ajv({ allErrors: true, strict: false });
  const ajvValidate = ajv.compile(schema);

  const patterns = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_PATTERNS;
  const files = await fg(patterns, { cwd: ROOT, absolute: true, dot: false });

  if (!files.length) {
    console.log('ℹ️  Keine Sigillin-Dateien gefunden (Patterns):', patterns.join(', '));
    process.exit(0);
  }

  let hasErrors = false;
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    try {
      let errs = [];
      if (ext === '.json') {
        const obj = await readJson(f);
        errs = await validateStructured(obj, ajvValidate);
      } else if (ext === '.yml' || ext === '.yaml') {
        const obj = await readYaml(f);
        errs = await validateStructured(obj, ajvValidate);
      } else if (ext === '.md') {
        errs = await validateMarkdown(f);
      } else {
        continue;
      }
      if (errs.length) {
        hasErrors = true;
        console.log(`❌ ${path.relative(ROOT, f)}`);
        for (const e of errs) console.log(`   - ${e}`);
      } else {
        console.log(`✅ ${path.relative(ROOT, f)}`);
      }
    } catch (e) {
      hasErrors = true;
      console.log(`❌ ${path.relative(ROOT, f)}\n   - Fehler: ${(e && e.message) || e}`);
    }
  }
  process.exit(hasErrors ? 1 : 0);
}

main().catch((e) => {
  console.error('Validator fatal:', e);
  process.exit(1);
});
