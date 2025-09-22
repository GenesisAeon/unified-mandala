#!/usr/bin/env node
// Shared validation utilities for Sigillin bridge artifacts.
// Provides reusable helpers for schema + semantic validation so that
// CLI tools (validate-sigillins, report generators, Git hooks) can
// rely on a single implementation.

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import yaml from 'js-yaml';
import fg from 'fast-glob';
import Ajv from 'ajv';

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

const BRIDGE_SIGIL_REGEX = /(^|\/)sigils\/bridges\/.+\.(json|ya?ml)$/i;
const BRIDGE_MD_REGEX = /(^|\/)docs\/sigillin\/bridges\/.+\.md$/i;

export const DEFAULT_PATTERNS = [
  'sigils/bridges/**/*.json',
  'sigils/bridges/**/*.yaml',
  'sigils/bridges/**/*.yml',
  'docs/sigillin/bridges/**/*.md',
];

function toPosix(p) {
  return (p || '').replaceAll('\\', '/');
}

function isBridgeSigilPath(relativePath) {
  return BRIDGE_SIGIL_REGEX.test(relativePath);
}

function isBridgeMarkdownPath(relativePath) {
  return BRIDGE_MD_REGEX.test(relativePath);
}

function isRegistryOrArchiveSigil(candidate, relativePath) {
  const sigillinType = (candidate?.sigillin_type ?? '').toString().toLowerCase();
  if (sigillinType.includes('registry') || sigillinType.includes('archive')) {
    return true;
  }
  if (relativePath && /bridges\.index\.ya?ml$/i.test(relativePath)) {
    return true;
  }
  return false;
}

function applySemanticOverlay(candidate) {
  const sigType = (candidate?.sigillin_type ?? '').toString().toLowerCase();
  if (!sigType.includes('agent')) {
    return;
  }

  if (!candidate.trace || typeof candidate.trace !== 'object') {
    candidate.trace = {};
  }
  const trace = candidate.trace;
  const crep = trace.CREP && typeof trace.CREP === 'object' ? trace.CREP : {};
  const metricEntries = Object.entries(crep).filter(([, value]) => Number.isFinite(value));
  if (metricEntries.length < 2) {
    if (!Number.isFinite(crep.coherence)) crep.coherence = 0.5;
    if (!Number.isFinite(crep.resonance)) crep.resonance = 0.5;
  }
  trace.CREP = crep;

  if (!Array.isArray(candidate.trikaya) || candidate.trikaya.length === 0) {
    candidate.trikaya = ['Nirmāṇakāya'];
  }

  if (!candidate.guidelines || typeof candidate.guidelines !== 'object') {
    candidate.guidelines = { next_action: 'Lege ein Mini-Sigillin mit CREP-Hypothese an.' };
  } else if (!candidate.guidelines.next_action) {
    candidate.guidelines.next_action = 'Lege ein Mini-Sigillin mit CREP-Hypothese an.';
  }
}

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

const schemaCache = new Map();

async function loadSchema(schemaPath) {
  const key = path.resolve(schemaPath);
  if (schemaCache.has(key)) {
    return schemaCache.get(key);
  }
  const schemaRaw = await fs.readFile(key, 'utf8');
  const schema = JSON.parse(schemaRaw);
  schemaCache.set(key, schema);
  return schema;
}

async function prepareAjv(schemaPath) {
  const schema = await loadSchema(schemaPath);
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validator = ajv.compile(schema);
  return validator;
}

async function validateStructured(obj, ajvValidate, relativePath, cwd) {
  const errors = [];
  const relPath = toPosix(relativePath || '');

  if (!isBridgeSigilPath(relPath)) {
    return { errors, skipped: true, skipReason: 'not bridge path' };
  }

  const ok = ajvValidate(obj);
  if (!ok) {
    for (const e of ajvValidate.errors || []) {
      const loc = e.instancePath || e.dataPath || '';
      errors.push(`Schema: ${loc} ${e.message}`);
    }
  }

  const sigillin = obj?.sigillin ?? obj ?? {};
  if (isRegistryOrArchiveSigil(sigillin, relPath)) {
    return { errors, skipped: true, skipReason: 'registry/archive' };
  }

  applySemanticOverlay(sigillin);

  const contentStr = JSON.stringify(obj);
  if (!includesAny(contentStr, CREP_KEYS)) errors.push('Content: CREP-Begriffe fehlen.');
  if (!includesAny(contentStr, TRIKAYA_KEYS)) errors.push('Content: Trikāya-Begriffe fehlen.');
  if (!includesAny(contentStr, NEXT_KEYS)) errors.push("Content: 'Nächste Schritte' fehlen.");

  const trace = sigillin.trace;
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
      return id.includes('guideline') || title.includes('leitlinie') || title.includes('guideline');
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

  const links = obj?.sigillin?.links || [];
  const root = cwd ?? process.cwd();
  for (const link of links) {
    if (typeof link !== 'string') continue;
    if (link.startsWith('aeon://')) continue;
    try {
      const maybePath = path.isAbsolute(link) ? link : path.join(root, link);
      await fs.access(maybePath);
    } catch {
      errors.push(`Hint: Verlinkte Datei nicht gefunden (optional): ${link}`);
    }
  }

  return { errors, skipped: false };
}

async function validateMarkdown(filepath, relativePath) {
  const relPath = toPosix(relativePath || '');
  if (!isBridgeMarkdownPath(relPath)) {
    return { errors: [], skipped: true, skipReason: 'not bridge path' };
  }
  const content = await readText(filepath);
  const errors = [];
  if (!includesAny(content, CREP_KEYS)) errors.push('MD: CREP-Begriffe fehlen.');
  if (!includesAny(content, TRIKAYA_KEYS)) errors.push('MD: Trikāya-Begriffe fehlen.');
  if (!includesAny(content, NEXT_KEYS)) errors.push("MD: 'Nächste Schritte' fehlen.");
  return { errors, skipped: false };
}

function mapKind(ext) {
  if (ext === '.json') return 'json';
  if (ext === '.yaml' || ext === '.yml') return 'yaml';
  if (ext === '.md') return 'markdown';
  return 'other';
}

export async function validatePatterns(patterns = DEFAULT_PATTERNS, options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const schemaPath =
    options.schemaPath ?? path.join(cwd, 'scripts', 'schemas', 'mandala-sigillin.schema.json');
  const resolvedPatterns = Array.isArray(patterns) && patterns.length ? patterns : DEFAULT_PATTERNS;

  const files = await fg(resolvedPatterns, { cwd, absolute: true, dot: false });
  if (!files.length) {
    return {
      results: [],
      hasErrors: false,
      usedPatterns: resolvedPatterns,
      matchedFiles: [],
    };
  }

  const ajvValidate = await prepareAjv(schemaPath);
  const results = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const relativePath = toPosix(path.relative(cwd, file));
    try {
      if (ext === '.json') {
        const obj = await readJson(file);
        const validation = await validateStructured(obj, ajvValidate, relativePath, cwd);
        results.push({
          filePath: file,
          relativePath,
          errors: validation.errors,
          skipped: validation.skipped,
          skipReason: validation.skipReason,
          kind: mapKind(ext),
        });
        continue;
      }
      if (ext === '.yaml' || ext === '.yml') {
        const obj = await readYaml(file);
        const validation = await validateStructured(obj, ajvValidate, relativePath, cwd);
        results.push({
          filePath: file,
          relativePath,
          errors: validation.errors,
          skipped: validation.skipped,
          skipReason: validation.skipReason,
          kind: mapKind(ext),
        });
        continue;
      }
      if (ext === '.md') {
        const validation = await validateMarkdown(file, relativePath);
        results.push({
          filePath: file,
          relativePath,
          errors: validation.errors,
          skipped: validation.skipped,
          skipReason: validation.skipReason,
          kind: mapKind(ext),
        });
        continue;
      }
      // Unknown extension -> skip silently.
    } catch (error) {
      results.push({
        filePath: file,
        relativePath,
        errors: [`Fehler: ${(error && error.message) || error}`],
        skipped: false,
        kind: mapKind(ext),
      });
    }
  }

  const hasErrors = results.some(
    (result) => !result.skipped && result.errors && result.errors.length,
  );

  return {
    results,
    hasErrors,
    usedPatterns: resolvedPatterns,
    matchedFiles: files.map((f) => toPosix(path.relative(cwd, f))),
  };
}

export function summarizeResults(results) {
  let failures = 0;
  let skipped = 0;
  let passes = 0;
  for (const result of results) {
    if (result.skipped) {
      skipped += 1;
      continue;
    }
    if (result.errors && result.errors.length) {
      failures += 1;
    } else {
      passes += 1;
    }
  }
  return { passes, failures, skipped, total: results.length };
}
