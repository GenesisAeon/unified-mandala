#!/usr/bin/env node
// Syncs MandalaMap.json from MandalaMap.yaml and generates a minimal MandalaMap.md summary.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const yamlPath = path.join(root, 'MandalaMap.yaml');
const jsonPath = path.join(root, 'MandalaMap.json');
const mdPath = path.join(root, 'MandalaMap.md');

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function readYaml(p) {
  const text = fs.readFileSync(p, 'utf8');
  return YAML.parse(text);
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

function writeJson(p, obj) {
  const pretty = JSON.stringify(stable(obj), null, 2);
  fs.writeFileSync(p, pretty + '\n');
}

function summarize(obj) {
  const lines = [];
  lines.push('# Mandala Map');
  lines.push('');
  const meta = obj?.meta || {};
  lines.push(`- Version: ${meta.version ?? 'n/a'}`);
  lines.push(`- Fraktal: ${meta.fraktal ?? 'n/a'}`);
  lines.push(`- Generated: ${meta.generated ?? 'n/a'}`);
  lines.push('');

  const entries = Array.isArray(obj?.entries) ? obj.entries : [];
  const categories = Object.keys(obj?.legend?.categories ?? {});
  const statuses = Object.keys(obj?.legend?.status ?? {});

  const byCategory = new Map();
  const byStatus = new Map();
  for (const e of entries) {
    const c = e.category ?? 'uncategorized';
    const s = e.status ?? 'unspecified';
    byCategory.set(c, (byCategory.get(c) || 0) + 1);
    byStatus.set(s, (byStatus.get(s) || 0) + 1);
  }

  lines.push(`Total entries: ${entries.length}`);
  lines.push('');
  lines.push('Categories:');
  const catSorted = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]);
  for (const [c, n] of catSorted) lines.push(`- ${c}: ${n}`);
  if (categories.length) lines.push(`- defined categories: ${categories.length}`);
  lines.push('');
  lines.push('Statuses:');
  const stSorted = Array.from(byStatus.entries()).sort((a, b) => b[1] - a[1]);
  for (const [s, n] of stSorted) lines.push(`- ${s}: ${n}`);
  if (statuses.length) lines.push(`- defined statuses: ${statuses.length}`);
  lines.push('');

  // Sample of entries per top categories (up to 5)
  const sampleCount = 5;
  if (catSorted.length) {
    const topCat = catSorted.slice(0, 3).map(([c]) => c);
    lines.push('Samples:');
    for (const c of topCat) {
      const sample = entries.filter((e) => e.category === c).slice(0, sampleCount);
      lines.push(`- ${c}:`);
      for (const e of sample) {
        const title = e.title || e.path;
        lines.push(`  - ${title} (${e.status ?? 'unspecified'}) — ${e.path}`);
      }
    }
    lines.push('');
  }

  lines.push('_Auto-generated summary. Edit YAML as the source of truth._');
  return lines.join('\n');
}

function main() {
  if (!exists(yamlPath)) {
    console.error('[mandala:sync] Missing MandalaMap.yaml (source of truth).');
    process.exit(0);
  }
  const y = readYaml(yamlPath);
  writeJson(jsonPath, y);
  fs.writeFileSync(mdPath, summarize(y) + '\n');
  console.log('[mandala:sync] Updated MandalaMap.json and MandalaMap.md from YAML.');
}

main();
