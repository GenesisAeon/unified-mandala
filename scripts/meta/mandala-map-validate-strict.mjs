#!/usr/bin/env node
// Strict validator for MandalaMap: exits non-zero on inconsistencies.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const yamlPath = path.join(root, 'MandalaMap.yaml');
const jsonPath = path.join(root, 'MandalaMap.json');

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
function readYaml(p) {
  return YAML.parse(fs.readFileSync(p, 'utf8'));
}
function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = stable(value[k]);
    return out;
  }
  return value;
}

function diffSummary(a, b) {
  const sa = JSON.stringify(stable(a));
  const sb = JSON.stringify(stable(b));
  return sa === sb;
}

function main() {
  let issues = 0;
  if (!exists(yamlPath)) {
    console.error('[mandala:strict] Missing MandalaMap.yaml');
    process.exit(1);
  }
  if (!exists(jsonPath)) {
    console.error('[mandala:strict] Missing MandalaMap.json');
    issues++;
  }
  const y = readYaml(yamlPath);
  if (!y || typeof y !== 'object') {
    console.error('[mandala:strict] Failed to parse MandalaMap.yaml');
    process.exit(1);
  }
  if (exists(jsonPath)) {
    let j;
    try {
      j = readJson(jsonPath);
    } catch {
      j = undefined;
    }
    if (j === undefined) {
      console.error('[mandala:strict] Failed to parse MandalaMap.json');
      issues++;
    } else if (!diffSummary(y, j)) {
      console.error('[mandala:strict] YAML/JSON content differ. Run "pnpm meta:mandala:sync".');
      issues++;
    }
  }

  const entries = Array.isArray(y.entries) ? y.entries : [];
  const cats = new Set(Object.keys(y?.legend?.categories ?? {}));
  const stats = new Set(Object.keys(y?.legend?.status ?? {}));
  let missingFields = 0,
    badCats = 0,
    badStats = 0;
  for (const e of entries) {
    if (!e || typeof e !== 'object') {
      missingFields++;
      continue;
    }
    if (!('path' in e) || !('category' in e) || !('status' in e)) missingFields++;
    if (e.category && !cats.has(e.category)) badCats++;
    if (e.status && !stats.has(e.status)) badStats++;
  }
  if (missingFields)
    console.error(`[mandala:strict] Entries with missing required fields: ${missingFields}`);
  if (badCats)
    console.error(`[mandala:strict] Entries referencing undefined categories: ${badCats}`);
  if (badStats)
    console.error(`[mandala:strict] Entries referencing undefined statuses: ${badStats}`);
  issues += missingFields + badCats + badStats;

  if (issues > 0) {
    process.exit(1);
  } else {
    console.log('[mandala:strict] OK');
  }
}

main();
