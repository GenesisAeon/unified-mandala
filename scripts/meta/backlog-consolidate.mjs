#!/usr/bin/env node
/*
 Consolidate fragmented backlog files under advancedToDo_parts/ into a compact index.
 - Scans for .md, .yaml/.yml, .json
 - Emits out/backlog/fragment-index.json with file list and basic metadata
 - Optionally merges into advancedprogress.json if present (non-destructive)
*/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'advancedToDo_parts');
const OUT_DIR = path.join(ROOT, 'out', 'backlog');
const OUT_FILE = path.join(OUT_DIR, 'fragment-index.json');
const ADV_PROGRESS = path.join(ROOT, 'advancedprogress.json');

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...listFiles(p));
    else files.push(p);
  }
  return files;
}

function readTitle(p) {
  try {
    const src = fs.readFileSync(p, 'utf8');
    const first = src.split(/\r?\n/, 3).find(Boolean) || '';
    return first.trim().slice(0, 160);
  } catch {
    return '';
  }
}

function main() {
  const exts = new Set(['.md', '.markdown', '.yml', '.yaml', '.json']);
  const files = listFiles(SRC_DIR).filter((p) => exts.has(path.extname(p).toLowerCase()));
  const now = new Date().toISOString();
  const items = files.map((p) => ({
    path: path.relative(ROOT, p).replace(/\\/g, '/'),
    size: fs.statSync(p).size,
    title: readTitle(p),
  }));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify({ generatedAt: now, count: items.length, items }, null, 2),
  );
  console.log(`Backlog index written: ${path.relative(ROOT, OUT_FILE)}`);

  if (fs.existsSync(ADV_PROGRESS)) {
    try {
      const current = JSON.parse(fs.readFileSync(ADV_PROGRESS, 'utf8'));
      current.backlogIndex = { updatedAt: now, count: items.length, items };
      fs.writeFileSync(ADV_PROGRESS, JSON.stringify(current, null, 2));
      console.log('advancedprogress.json updated with backlogIndex');
    } catch (e) {
      console.warn('Skipping merge into advancedprogress.json:', e?.message || e);
    }
  }
}

main();
