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
const TRIKAYA_BASE_TERMS = ['dharmakāya', 'sambhogakāya', 'nirmāṇakāya'];
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
  const normalized = haystack.toLowerCase();
  return needles.some((k) => normalized.includes(k.toLowerCase()));
}

function collectStrings(value, bucket) {
  if (typeof value === 'string') {
    bucket.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, bucket);
    return;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectStrings(item, bucket);
  }
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
  const sigillin = obj?.sigillin ?? {};
  const sigType = (sigillin?.sigillin_type ?? '').toString().toLowerCase();
  const skipSemantic = sigType === 'registry';

  const contentStr = JSON.stringify(obj);
  if (!skipSemantic) {
    if (!includesAny(contentStr, CREP_KEYS)) errors.push('Content: CREP-Begriffe fehlen.');
    if (!includesAny(contentStr, TRIKAYA_KEYS)) errors.push('Content: Trikāya-Begriffe fehlen.');
    if (!includesAny(contentStr, NEXT_KEYS)) errors.push("Content: 'Nächste Schritte' fehlen.");
  }

  const trace = sigillin.trace;
  if (!skipSemantic) {
    if (!trace || typeof trace !== 'object') {
      errors.push('Trace: CREP-Struktur fehlt.');
    } else {
      const crep = trace.CREP;
      if (!crep || typeof crep !== 'object') {
        errors.push('Trace: CREP-Metriken fehlen.');
      } else {
        const metrics = Object.entries(crep).filter(([, value]) => Number.isFinite(value));
        if (metrics.length < 2) {
          errors.push('Trace: Mindestens zwei CREP-Metriken erforderlich.');
        }
        for (const [key, value] of metrics) {
          if (value < 0 || value > 1) {
            errors.push(`Trace: CREP-Wert ${key} außerhalb des erwarteten Bereichs (0–1).`);
            break;
          }
        }
      }
      if ('emergence_score' in trace) {
        const score = trace.emergence_score;
        if (typeof score !== 'number' || Number.isNaN(score) || score < 0) {
          errors.push('Trace: emergence_score muss eine nicht-negative Zahl sein.');
        }
      }
    }

    const sections = sigillin?.content?.sections;
    if (Array.isArray(sections) && sections.length) {
      const textFragments = [];
      for (const section of sections) collectStrings(section, textFragments);
      const trikayaHits = new Set();
      for (const fragment of textFragments) {
        const lower = fragment.toLowerCase();
        for (const base of TRIKAYA_BASE_TERMS) {
          if (lower.includes(base)) {
            trikayaHits.add(base);
          }
        }
      }
      if (trikayaHits.size < 1) {
        errors.push('Content: Mindestens eine Trikāya-Ebene muss konkret benannt sein.');
      }
      const guidelinesSection = sections.find((section) => {
        const id = (section?.id ?? '').toString().toLowerCase();
        const title = (section?.title ?? '').toString().toLowerCase();
        return (
          id.includes('guideline') || title.includes('leitlinie') || title.includes('guideline')
        );
      });
      if (!guidelinesSection) {
        errors.push('Content: Leitlinien-Sektion fehlt.');
      } else {
        const rules = Array.isArray(guidelinesSection.rules) ? guidelinesSection.rules : [];
        if (!rules.length) {
          errors.push('Content: Leitlinien enthalten keine Regeln.');
        }
        const hasNextAction = rules.some((rule) => {
          if (typeof rule !== 'string') return false;
          const lower = rule.toLowerCase();
          return NEXT_KEYS.some((key) => lower.includes(key.toLowerCase()));
        });
        if (!hasNextAction) {
          errors.push('Content: Leitlinien benennen keine nächste Handlung.');
        }
      }
    } else {
      errors.push('Content: sections fehlen oder sind leer.');
    }
  }

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
