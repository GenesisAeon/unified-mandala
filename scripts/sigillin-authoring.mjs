#!/usr/bin/env node
import process from 'node:process';
import { parseArgs } from 'node:util';
import { spawn } from 'node:child_process';

import {
  PROVIDERS,
  getProvider,
  updateRegistryFile,
  writeBridgeArtifacts,
  gatherBridgeSummary,
} from './lib/interai-bridges.mjs';

function printHelp() {
  console.log(`Sigillin Authoring CLI
Usage: pnpm sigillins:authoring <command> [options]

Commands:
  list                       Zeigt verfügbare Bridge-Provider.
  scaffold [opts]            Schreibt Bridge-Dateien (YAML/JSON/MD).
  sync-registry [opts]       Aktualisiert sigils/bridges/bridges.index.yaml.
  status [opts]              Zeigt CREP/Trikāya Übersicht (optional als JSON).
  help                       Diese Hilfe.

Scaffold Optionen:
  --providers <keys...>      Eine oder mehrere Provider-Keys (chatgpt, mistral, ...).
  --all                      Alle Provider aktualisieren (Standard).
  --dry-run                  Nur anzeigen, keine Dateien schreiben.
  --no-markdown              Markdown-Dateien auslassen.
  --no-json                  JSON-Dateien auslassen.
  --no-yaml                  YAML-Dateien auslassen.
  --sync-registry            Nach dem Schreiben Index aktualisieren.
  --validate                 Anschließend pnpm validate:sigillins ausführen.

Status Optionen:
  --json                     Ausgabe als JSON.
`);
}

function resolveProviders(keys) {
  if (!keys || !keys.length) return PROVIDERS;
  const resolved = [];
  const missing = [];
  for (const key of keys) {
    const provider = getProvider(key);
    if (!provider) {
      missing.push(key);
    } else {
      resolved.push(provider);
    }
  }
  if (missing.length) {
    throw new Error(`Unbekannte Provider: ${missing.join(', ')}`);
  }
  return resolved;
}

async function runScaffold(args) {
  const { values } = parseArgs({
    args,
    options: {
      providers: { type: 'string', multiple: true },
      all: { type: 'boolean', default: false },
      dryRun: { type: 'boolean', default: false },
      'no-markdown': { type: 'boolean', default: false },
      'no-json': { type: 'boolean', default: false },
      'no-yaml': { type: 'boolean', default: false },
      'sync-registry': { type: 'boolean', default: false },
      validate: { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });

  let providerKeys = [];
  if (values.providers?.length) {
    for (const entry of values.providers) {
      providerKeys.push(
        ...entry
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      );
    }
  }
  if (values.all || !providerKeys.length) {
    providerKeys = PROVIDERS.map((provider) => provider.key);
  }

  const providers = resolveProviders([...new Set(providerKeys)]);

  for (const provider of providers) {
    await writeBridgeArtifacts(provider, {
      dryRun: values.dryRun,
      includeMarkdown: !values['no-markdown'],
      includeJson: !values['no-json'],
      includeYaml: !values['no-yaml'],
    });
  }

  if (values['sync-registry']) {
    await updateRegistryFile(process.cwd(), PROVIDERS, values.dryRun);
  }

  if (values.validate) {
    await runValidator();
  }
}

async function runValidator() {
  await new Promise((resolve, reject) => {
    const child = spawn('pnpm', ['validate:sigillins'], { stdio: 'inherit' });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`pnpm validate:sigillins exited with code ${code}`));
    });
    child.on('error', (err) => reject(err));
  });
}

async function runSyncRegistry(args) {
  const { values } = parseArgs({
    args,
    options: {
      dryRun: { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });
  await updateRegistryFile(process.cwd(), PROVIDERS, values.dryRun);
}

function formatNumber(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '–';
  return value.toFixed(3);
}

function renderTable(summary) {
  const header = [
    'Provider',
    'C',
    'R',
    'E',
    'P',
    'Next Action',
    'Dharmakāya',
    'Sambhogakāya',
    'Nirmāṇakāya',
  ];
  const rows = [header];
  for (const provider of summary.providers) {
    if (provider.error) {
      rows.push([provider.label, 'error', provider.error]);
      continue;
    }
    rows.push([
      provider.label,
      formatNumber(provider.crep.C),
      formatNumber(provider.crep.R),
      formatNumber(provider.crep.E),
      formatNumber(provider.crep.P),
      provider.nextActionRule ? '✅' : '⚠️',
      provider.trikaya.dharmakāya ? '✅' : '⚠️',
      provider.trikaya.sambhogakāya ? '✅' : '⚠️',
      provider.trikaya.nirmāṇakāya ? '✅' : '⚠️',
    ]);
  }
  const colWidths = header.map((_, colIndex) =>
    rows.reduce((max, row) => Math.max(max, (row[colIndex] ?? '').toString().length), 0),
  );
  for (const row of rows) {
    const line = row
      .map((cell, index) => {
        const value = (cell ?? '').toString();
        const pad = ' '.repeat(colWidths[index] - value.length);
        return value + pad;
      })
      .join('  ');
    console.log(line);
  }
  console.log('\nAggregierte CREP-Mittelwerte (C/R/E/P):', summary.aggregates.crep.avg);
  console.log('Trikāya-Abdeckung:', summary.aggregates.trikayaCoverage);
  console.log('Next-Action-Rate:', summary.aggregates.nextActionRate);
}

async function runStatus(args) {
  const { values } = parseArgs({
    args,
    options: {
      json: { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });
  const summary = await gatherBridgeSummary();
  if (values.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }
  renderTable(summary);
}

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case 'list':
      for (const provider of PROVIDERS) {
        console.log(`${provider.key.padEnd(8)} – ${provider.label}`);
      }
      break;
    case 'scaffold':
      await runScaffold(args);
      break;
    case 'sync-registry':
      await runSyncRegistry(args);
      break;
    case 'status':
      await runStatus(args);
      break;
    case 'help':
    case undefined:
      printHelp();
      break;
    default:
      console.error(`Unbekannter Befehl: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error('sigillin-authoring failed:', error);
  process.exit(1);
});
