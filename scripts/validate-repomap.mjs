#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const REQUIRED_FILES = [
  path.join(projectRoot, 'analysis', 'repo-map.json'),
  path.join(projectRoot, 'analysis', 'repo-map.csv'),
  path.join(projectRoot, 'analysis', 'scripts-and-commands.json'),
];

let ok = true;

for (const file of REQUIRED_FILES) {
  if (!fs.existsSync(file)) {
    ok = false;
    console.error(`❌ Missing required repo-map artifact: ${path.relative(projectRoot, file)}`);
  }
}

if (!ok) {
  process.exitCode = 1;
  process.exit();
}

try {
  const repoMapRaw = fs.readFileSync(REQUIRED_FILES[0], 'utf8');
  const repoMap = JSON.parse(repoMapRaw);
  if (!Array.isArray(repoMap) || repoMap.length === 0) {
    console.error('❌ analysis/repo-map.json is empty or not an array.');
    ok = false;
  }
} catch (error) {
  ok = false;
  console.error(
    '❌ Unable to parse analysis/repo-map.json:',
    error instanceof Error ? error.message : error,
  );
}

try {
  const scriptsRaw = fs.readFileSync(REQUIRED_FILES[2], 'utf8');
  const scripts = JSON.parse(scriptsRaw);
  if (!scripts || typeof scripts !== 'object') {
    console.error('❌ analysis/scripts-and-commands.json is not an object.');
    ok = false;
  }
} catch (error) {
  ok = false;
  console.error(
    '❌ Unable to parse analysis/scripts-and-commands.json:',
    error instanceof Error ? error.message : error,
  );
}

if (ok) {
  console.log('✅ Repo map artifacts look good.');
} else {
  process.exitCode = 1;
}
