#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const primary = spawnSync('node', ['scripts/run-dist.mjs', 'scripts/repo-map.ts'], {
  cwd: projectRoot,
  stdio: 'inherit',
});

if (!primary.error && (primary.status ?? 0) === 0) {
  process.exit(0);
}

console.warn('[repomap] Primary generator failed – creating fallback artefacts.');

const analysisDir = path.join(projectRoot, 'analysis');
fs.mkdirSync(analysisDir, { recursive: true });

const entries = buildFallbackEntries();
const jsonPath = path.join(analysisDir, 'repo-map.json');
fs.writeFileSync(jsonPath, JSON.stringify(entries, null, 2));

const csvPath = path.join(analysisDir, 'repo-map.csv');
fs.writeFileSync(csvPath, toCsv(entries), 'utf8');

const scriptsPath = path.join(analysisDir, 'scripts-and-commands.json');
fs.writeFileSync(scriptsPath, JSON.stringify(buildFallbackScripts(), null, 2));

console.log(`[repomap] Fallback artefacts written → ${path.relative(projectRoot, jsonPath)}`);

function buildFallbackEntries() {
  const ignore = new Set(['.git', 'node_modules', '.pnpm', 'dist', 'out', '.husky']);
  const dirs = fs
    .readdirSync(projectRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !ignore.has(entry.name));

  const classify = (name) => {
    if (name === 'apps') return 'app';
    if (name === 'packages') return 'package';
    if (name === 'services') return 'service';
    if (name === 'docs') return 'docs';
    if (name === 'scripts') return 'script';
    if (name === 'analysis') return 'docs';
    if (name === 'go-agent' || name === 'go-bridge') return 'service';
    return 'other';
  };

  const items = dirs.map((entry) => ({
    path: entry.name,
    type: classify(entry.name),
    name: entry.name,
  }));

  if (items.length === 0) {
    items.push({ path: '.', type: 'other', name: 'root' });
  }

  return items;
}

function toCsv(rows) {
  const header = ['type', 'path', 'name'];
  const escape = (value) => (value ?? '').replace(/"/g, '""');
  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push([row.type, `"${escape(row.path)}"`, `"${escape(row.name)}"`].join(','));
  }
  return lines.join('\n');
}

function buildFallbackScripts() {
  try {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg && typeof pkg.scripts === 'object') {
      return { root: pkg.scripts };
    }
  } catch (error) {
    console.warn('[repomap] Unable to read package.json scripts for fallback:', error.message);
  }
  return { root: {} };
}
