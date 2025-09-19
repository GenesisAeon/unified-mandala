#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';
import yaml from 'js-yaml';

import { gatherBridgeSummary } from './lib/interai-bridges.mjs';

function formatNumber(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '–';
  return value.toFixed(3);
}

function renderMarkdown(summary) {
  const header = [
    'Provider',
    'C',
    'R',
    'E',
    'P',
    'Ø CREP',
    'Next',
    'Dharmakāya',
    'Sambhogakāya',
    'Nirmāṇakāya',
  ];
  const rows = [header];
  for (const provider of summary.providers) {
    if (provider.error) {
      rows.push([provider.label, 'error', provider.error, '', '', '', '', '', '', '']);
      continue;
    }
    rows.push([
      provider.label,
      formatNumber(provider.crep.C),
      formatNumber(provider.crep.R),
      formatNumber(provider.crep.E),
      formatNumber(provider.crep.P),
      formatNumber(provider.averageCREP),
      provider.nextActionRule ? '✅' : '⚠️',
      provider.trikaya.dharmakāya ? '✅' : '⚠️',
      provider.trikaya.sambhogakāya ? '✅' : '⚠️',
      provider.trikaya.nirmāṇakāya ? '✅' : '⚠️',
    ]);
  }

  const tableLines = rows
    .map((row, index) => {
      const line = `| ${row.join(' | ')} |`;
      if (index === 0) {
        const divider = `| ${row.map(() => '---').join(' | ')} |`;
        return [line, divider].join('\n');
      }
      return line;
    })
    .join('\n');

  const aggregate = summary.aggregates;
  return `# Trikāya Dashboard Prototype

_Generated: ${summary.generatedAt}_

## CREP Coverage

${tableLines}

## Aggregates

- **Average CREP**: C=${formatNumber(aggregate.crep.avg.C)}, R=${formatNumber(aggregate.crep.avg.R)}, E=${formatNumber(aggregate.crep.avg.E)}, P=${formatNumber(aggregate.crep.avg.P)}
- **Trikāya coverage**: Dharmakāya ${aggregate.trikayaCoverage.dharmakāya}, Sambhogakāya ${aggregate.trikayaCoverage.sambhogakāya}, Nirmāṇakāya ${aggregate.trikayaCoverage.nirmāṇakāya}
- **Next-action rate**: ${aggregate.nextActionRate}

## Notes

- Data source: sigils/bridges/*/*.sigil.json processed via scripts/generate-trikaya-dashboard.mjs.
- CREP/Trikāya compliance reflects schema + semantic validation outcomes.
- Use \`pnpm sigillins:authoring status --json\` for CLI-friendly output.
`;
}

async function main() {
  const summary = await gatherBridgeSummary();
  const root = process.cwd();
  const outDir = path.join(root, 'analysis');
  await fs.mkdir(outDir, { recursive: true });

  const jsonPath = path.join(outDir, 'trikaya-dashboard.json');
  const mdPath = path.join(outDir, 'trikaya-dashboard.md');
  const yamlPath = path.join(outDir, 'trikaya-dashboard.yaml');

  await fs.writeFile(jsonPath, JSON.stringify(summary, null, 2));
  await fs.writeFile(mdPath, renderMarkdown(summary), 'utf8');
  await fs.writeFile(yamlPath, yaml.dump(summary, { lineWidth: 120 }));

  console.log('Trikāya dashboard artifacts written:');
  console.log(' -', path.relative(root, jsonPath));
  console.log(' -', path.relative(root, mdPath));
  console.log(' -', path.relative(root, yamlPath));
}

main().catch((error) => {
  console.error('generate-trikaya-dashboard failed:', error);
  process.exit(1);
});
