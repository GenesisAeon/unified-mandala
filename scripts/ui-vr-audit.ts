#!/usr/bin/env node
/**
 * UI/VR Audit: listet React-Komponenten (TSX) + rudimentäre Props-Signaturen,
 * VR-Schlüsseldateien und markiert TODO/Placeholder.
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, resolve, sep } from 'path';

const repoRoot = resolveRepoRoot();
const repoMapPath = join(repoRoot, 'analysis', 'repo-map.json');

ensureRepoMap();

const map = JSON.parse(readFileSync(repoMapPath, 'utf8')) as {
  path: string;
  type: string;
}[];
const ui = map.filter((x) => x.type === 'ui' && x.path.endsWith('.tsx'));
const vr = map.filter((x) => x.type === 'vr');

function summarizeTSX(p: string) {
  const s = readFileSync(p, 'utf8');
  const name =
    /export\s+default\s+function\s+([A-Z]\w*)/.exec(s)?.[1] ||
    /const\s+([A-Z]\w*)\s*:\s*React\.FC/.exec(s)?.[1] ||
    /export\s+default\s+([A-Z]\w*)/.exec(s)?.[1] ||
    'Component';
  const hasTodo = /TODO|Placeholder/i.test(s);
  const props =
    /\(\s*\{\s*([^}]*)\}\s*:\s*[^)]*\)/
      .exec(s)?.[1]
      ?.split(',')
      .map((x) => x.trim())
      .slice(0, 6) || [];
  return { name, hasTodo, props };
}

const uiReport = ui.map((x) => ({ path: x.path, ...summarizeTSX(x.path) }));
const report = { ui: uiReport, vr };

writeFileSync('analysis/ui-vr-audit.json', JSON.stringify(report, null, 2));
console.log('✅ analysis/ui-vr-audit.json');

function ensureRepoMap() {
  if (existsSync(repoMapPath)) {
    return;
  }

  const distRepoMap = join(repoRoot, 'dist', 'scripts', 'repo-map.js');
  if (!existsSync(distRepoMap)) {
    console.error(
      'analysis/repo-map.json is missing and dist/scripts/repo-map.js is not available. Run `pnpm maps:build` first.',
    );
    process.exit(1);
  }

  const result = spawnSync(process.execPath, [distRepoMap], {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  if ((result.status ?? 1) !== 0) {
    console.error('Failed to generate analysis/repo-map.json via dist/scripts/repo-map.js.');
    process.exit(result.status ?? 1);
  }

  if (!existsSync(repoMapPath)) {
    console.error('analysis/repo-map.json is still missing after running the generator.');
    process.exit(1);
  }
}

function resolveRepoRoot() {
  const currentFile = fileURLToPath(import.meta.url);
  const scriptDir = dirname(currentFile);
  let rootCandidate = resolve(scriptDir, '..');
  if (rootCandidate.endsWith(`${sep}dist`)) {
    rootCandidate = resolve(rootCandidate, '..');
  }
  return rootCandidate;
}
