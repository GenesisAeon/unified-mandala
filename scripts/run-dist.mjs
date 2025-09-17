#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const nodeCommand = process.platform === 'win32' ? 'node.exe' : 'node';

const [, , sourceArg, ...forwarded] = process.argv;

if (!sourceArg) {
  console.error('Usage: node scripts/run-dist.mjs <source-file> [...args]');
  process.exit(1);
}

const sourceRelative = resolveSourceRelative(sourceArg);
const distRelative = toDistRelative(sourceRelative);
const distAbsolute = path.join(repoRoot, 'dist', distRelative);

ensureSourceExists(sourceRelative);
ensureDistReady(distRelative, distAbsolute);

const nodeArgs = ['--enable-source-maps', distAbsolute, ...forwarded];
const runResult = spawnSync(nodeCommand, nodeArgs, {
  cwd: repoRoot,
  stdio: 'inherit',
});

if (runResult.error) {
  console.error(`[run-dist] Failed to execute ${distRelative}:`, runResult.error.message);
  process.exit(runResult.status ?? 1);
}

process.exit(runResult.status ?? 0);

function resolveSourceRelative(input) {
  const normalised = normalisePath(input);
  if (path.isAbsolute(normalised)) {
    const relative = path.relative(repoRoot, normalised);
    if (relative.startsWith('..')) {
      console.error(`[run-dist] Source ${input} is outside of the repository root.`);
      process.exit(1);
    }
    return normalisePath(relative);
  }
  return normalised.replace(/^\.\//, '');
}

function normalisePath(p) {
  return p.replace(/\\/g, '/');
}

function toDistRelative(source) {
  const replaced = source.replace(/\.[cm]?[tj]sx?$/i, '.js');
  if (replaced === source) {
    console.error(
      `[run-dist] Unsupported source extension for ${source}. Expected TypeScript entry.`,
    );
    process.exit(1);
  }
  return replaced;
}

function ensureSourceExists(source) {
  const abs = path.join(repoRoot, source);
  if (!existsSync(abs)) {
    console.error(`[run-dist] Source file ${source} was not found. Did you spell it correctly?`);
    process.exit(1);
  }
}

function ensureDistReady(distRelative, distAbsolute) {
  if (existsSync(distAbsolute)) return;

  if (process.env.UM_RUN_DIST_SKIP_BUILD === '1') {
    console.error(
      `[run-dist] Missing dist/${distRelative}. Run a build first or unset UM_RUN_DIST_SKIP_BUILD to allow auto-build.`,
    );
    process.exit(1);
  }

  const customBuild = process.env.UM_RUN_DIST_BUILD_CMD;
  let buildResult;

  if (customBuild && customBuild.trim().length > 0) {
    console.log(`[run-dist] Running custom build command: ${customBuild}`);
    buildResult = spawnSync(customBuild, {
      cwd: repoRoot,
      stdio: 'inherit',
      shell: true,
    });
  } else {
    console.log(`[run-dist] Building workspace to materialise dist/${distRelative}...`);
    buildResult = spawnSync(pnpmCommand, ['-s', 'build'], {
      cwd: repoRoot,
      stdio: 'inherit',
    });
  }

  if (buildResult.error) {
    console.error('[run-dist] Build command failed to start:', buildResult.error.message);
    process.exit(buildResult.status ?? 1);
  }

  if ((buildResult.status ?? 1) !== 0) {
    console.error(`[run-dist] Build command exited with status ${buildResult.status}.`);
    process.exit(buildResult.status ?? 1);
  }

  if (!existsSync(distAbsolute)) {
    console.error(`[run-dist] Expected dist/${distRelative} after build but it is still missing.`);
    process.exit(1);
  }
}
