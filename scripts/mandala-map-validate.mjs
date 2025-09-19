#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'yaml';

const ROOT = process.cwd();

async function readJson(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  const raw = await fs.readFile(fullPath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `MandalaMap JSON konnte nicht geparst werden (${relativePath}): ${error.message}`,
    );
  }
}

async function readYaml(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  const raw = await fs.readFile(fullPath, 'utf8');
  try {
    return yaml.parse(raw);
  } catch (error) {
    throw new Error(
      `MandalaMap YAML konnte nicht geparst werden (${relativePath}): ${error.message}`,
    );
  }
}

async function readText(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  return fs.readFile(fullPath, 'utf8');
}

function collectPaths(entries) {
  return new Map(entries.map((entry) => [entry.path, entry]));
}

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const jsonMap = await readJson('MandalaMap.json');
  const yamlMap = await readYaml('MandalaMap.yaml');
  const mdContent = await readText('MandalaMap.md');

  const jsonEntries = Array.isArray(jsonMap.entries) ? jsonMap.entries : [];
  const yamlEntries = Array.isArray(yamlMap.entries) ? yamlMap.entries : [];

  ensure(jsonEntries.length > 0, 'MandalaMap.json enthält keine entries.');
  ensure(yamlEntries.length > 0, 'MandalaMap.yaml enthält keine entries.');
  ensure(
    mdContent.includes('# Mandala Map'),
    'MandalaMap.md scheint kein MandalaMap-Dokument zu sein.',
  );

  const jsonPaths = collectPaths(jsonEntries);
  const yamlPaths = collectPaths(yamlEntries);

  ensure(
    jsonEntries.length === yamlEntries.length,
    `Eintragsanzahl unterscheidet sich (JSON=${jsonEntries.length}, YAML=${yamlEntries.length}).`,
  );

  const yamlMissing = [...jsonPaths.keys()].filter((p) => !yamlPaths.has(p));
  ensure(
    yamlMissing.length === 0,
    `MandalaMap.yaml fehlt folgende paths: ${yamlMissing.join(', ')}`,
  );

  const jsonMissing = [...yamlPaths.keys()].filter((p) => !jsonPaths.has(p));
  ensure(
    jsonMissing.length === 0,
    `MandalaMap.json fehlt folgende paths: ${jsonMissing.join(', ')}`,
  );

  const requiredPaths = ['sigils/bridges/bridges.index.yaml', '.github/'];
  const missingRequired = requiredPaths.filter((p) => !jsonPaths.has(p));
  ensure(missingRequired.length === 0, `MandalaMap entries fehlen: ${missingRequired.join(', ')}`);

  ensure(
    mdContent.includes('sigils/bridges/bridges.index.yaml'),
    'MandalaMap.md verweist nicht auf sigils/bridges/bridges.index.yaml.',
  );

  const summary = {
    entries: jsonEntries.length,
    meta: jsonMap.meta ?? {},
    followUps: Array.isArray(jsonMap.follow_up) ? jsonMap.follow_up.length : 0,
  };

  await fs.mkdir(path.join(ROOT, 'analysis'), { recursive: true });
  await fs.writeFile(
    path.join(ROOT, 'analysis', 'mandala-map-summary.json'),
    JSON.stringify(summary, null, 2),
  );

  console.log(
    `✅ MandalaMap validiert – ${jsonEntries.length} entries, Summary in analysis/mandala-map-summary.json`,
  );
}

main().catch((error) => {
  console.error('❌ MandalaMap Validierung fehlgeschlagen:', error.message);
  process.exit(1);
});
