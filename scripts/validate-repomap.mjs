#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const jsonPath = path.join(projectRoot, 'analysis', 'repo-map.json');
const csvPath = path.join(projectRoot, 'analysis', 'repo-map.csv');
const scriptsPath = path.join(projectRoot, 'analysis', 'scripts-and-commands.json');

let ok = true;

if (!fs.existsSync(jsonPath)) {
  console.error('❌ Missing repo map JSON artefact (analysis/repo-map.json).');
  ok = false;
}

let repoMap;
if (ok) {
  try {
    repoMap = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    if (!Array.isArray(repoMap) || repoMap.length === 0) {
      console.error('❌ analysis/repo-map.json is empty or not an array.');
      ok = false;
    } else if (!repoMap.every((entry) => typeof entry.path === 'string')) {
      console.error('❌ analysis/repo-map.json entries require a path field.');
      ok = false;
    }
  } catch (error) {
    ok = false;
    console.error(
      '❌ Unable to parse analysis/repo-map.json:',
      error instanceof Error ? error.message : error,
    );
  }
}

if (fs.existsSync(scriptsPath)) {
  try {
    const scripts = JSON.parse(fs.readFileSync(scriptsPath, 'utf8'));
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
} else {
  console.warn('⚠️ analysis/scripts-and-commands.json not found – skipping scripts validation.');
}

if (fs.existsSync(csvPath)) {
  try {
    const csv = fs.readFileSync(csvPath, 'utf8');
    if (!csv.trim()) {
      console.error('❌ analysis/repo-map.csv is empty.');
      ok = false;
    }
  } catch (error) {
    ok = false;
    console.error(
      '❌ Unable to read analysis/repo-map.csv:',
      error instanceof Error ? error.message : error,
    );
  }
} else {
  console.warn('⚠️ analysis/repo-map.csv not found – CSV validation skipped.');
}

if (ok) {
  console.log('✅ Repo map artifacts look good.');
} else {
  process.exitCode = 1;
}
