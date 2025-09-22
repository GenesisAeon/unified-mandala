#!/usr/bin/env node
// Generates machine-readable (JUnit XML) and human-readable (Markdown)
// reports for the Sigillin bridge catalogue. Builds on the shared
// validator utilities so that CI pipelines and governance reviews can
// publish consistent artefacts.

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';

import { DEFAULT_PATTERNS, validatePatterns, summarizeResults } from './lib/sigillin-validator.mjs';
import { PROVIDERS, bridgePaths, gatherBridgeSummary } from './lib/interai-bridges.mjs';

function toPosix(p) {
  return (p || '').replaceAll('\\', '/');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function statusToken(result) {
  if (!result) return '–';
  if (result.skipped) return '⏭️ Skip';
  if (result.errors && result.errors.length) return '❌ Fail';
  return '✅ Pass';
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function deriveClassName(relativePath) {
  if (!relativePath) return 'sigillin.validation';
  const withoutExt = relativePath.replace(/\.[^.]+$/, '');
  return `sigillin.${withoutExt.replace(/[\/]/g, '.')}`;
}

async function writeJUnitReport(results, outDir) {
  const testResults = results.filter((result) => !result.skipped);
  const summary = summarizeResults(results);

  const suites = [];
  for (const result of testResults) {
    const failure =
      result.errors && result.errors.length
        ? `<failure message="${escapeXml(result.errors[0])}">${escapeXml(result.errors.join('\n'))}</failure>`
        : '';
    const testCase = `<testcase name="Validate ${escapeXml(result.relativePath)}" classname="${escapeXml(
      deriveClassName(result.relativePath),
    )}" time="0">${failure}</testcase>`;
    suites.push(
      `<testsuite name="Sigillin ${escapeXml(result.relativePath)}" tests="1" failures="${
        result.errors && result.errors.length ? 1 : 0
      }">${testCase}</testsuite>`,
    );
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<testsuites tests="${summary.total}" failures="${summary.failures}">\n${suites.join('\n')}\n</testsuites>\n`;

  const target = path.join(outDir, 'sigillins-junit-report.xml');
  await ensureDir(outDir);
  await fs.writeFile(target, xml, 'utf8');
  console.log(`✅ JUnit report geschrieben: ${toPosix(path.relative(process.cwd(), target))}`);
}

async function writeMarkdownReport(results, outDir) {
  const resultByPath = new Map();
  for (const result of results) {
    resultByPath.set(result.relativePath, result);
  }

  const summary = await gatherBridgeSummary();

  let markdown = `# 🛡️ Sigillin Validation Summary\n\n`;
  markdown += `*Generiert am:* ${new Date().toUTCString()}\\n\n`;
  markdown += `| Provider | YAML | JSON | Markdown | Avg CREP | Emergence | Next Action | Dharmakāya | Sambhogakāya | Nirmāṇakāya |\\n`;
  markdown += `|---|---|---|---|---|---|---|---|---|---|\n`;

  for (const provider of PROVIDERS) {
    const paths = bridgePaths(provider);
    const yamlRel = toPosix(path.relative(process.cwd(), paths.yaml));
    const jsonRel = toPosix(path.relative(process.cwd(), paths.json));
    const mdRel = toPosix(path.relative(process.cwd(), paths.markdown));
    const yamlResult = resultByPath.get(yamlRel);
    const jsonResult = resultByPath.get(jsonRel);
    const mdResult = resultByPath.get(mdRel);

    const providerSummary = summary.providers.find((entry) => entry.key === provider.key);
    const avgCREP = providerSummary?.averageCREP ?? '–';
    const emergence = providerSummary?.emergence_score ?? '–';
    const nextAction = providerSummary?.nextActionRule ? '✅' : '⚠️';
    const dharma = providerSummary?.trikaya?.dharmakāya ? '✅' : '⚠️';
    const sambhoga = providerSummary?.trikaya?.sambhogakāya ? '✅' : '⚠️';
    const nirmana = providerSummary?.trikaya?.nirmāṇakāya ? '✅' : '⚠️';

    markdown += `| ${provider.label} | ${statusToken(yamlResult)} | ${statusToken(jsonResult)} | ${statusToken(mdResult)} | ${avgCREP} | ${emergence ?? '–'} | ${nextAction} | ${dharma} | ${sambhoga} | ${nirmana} |\n`;

    for (const [label, result] of [
      ['YAML', yamlResult],
      ['JSON', jsonResult],
      ['Markdown', mdResult],
    ]) {
      if (result && !result.skipped && result.errors && result.errors.length) {
        markdown += `\n**Fehler (${provider.label} · ${label}):**\n`;
        markdown += result.errors.map((error) => `* ${error}`).join('\n');
        markdown += '\n';
      }
    }
  }

  const avgCrepText = summary.aggregates?.crep?.avg
    ? ['C', 'R', 'E', 'P']
        .map((metric) => `${metric}=${summary.aggregates.crep.avg[metric] ?? '–'}`)
        .join(' | ')
    : '–';
  const trikayaCoverage = summary.aggregates?.trikayaCoverage
    ? Object.entries(summary.aggregates.trikayaCoverage)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' | ')
    : '–';

  markdown += '\n---\n\n';
  markdown += `**Gesamt:** ${summary.providers.length} Provider · CREP Ø ${avgCrepText} · Next-Action-Rate ${summary.aggregates.nextActionRate}.\n`;
  markdown += `Trikāya-Abdeckung: ${trikayaCoverage}\n`;

  const target = path.join(outDir, 'sigillins-report.md');
  await ensureDir(outDir);
  await fs.writeFile(target, markdown, 'utf8');
  console.log(`✅ Markdown report geschrieben: ${toPosix(path.relative(process.cwd(), target))}`);
}

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      junit: { type: 'boolean', default: true },
      markdown: { type: 'boolean', default: true },
      'out-dir': { type: 'string', default: 'reports' },
    },
    allowPositionals: true,
  });

  const patterns = positionals.length ? positionals : DEFAULT_PATTERNS;

  const { results, hasErrors, matchedFiles } = await validatePatterns(patterns, {
    cwd: process.cwd(),
  });

  if (!matchedFiles.length) {
    console.log('ℹ️  Keine Sigillin-Dateien gefunden – Reports werden übersprungen.');
    return;
  }

  const outDir = path.resolve(process.cwd(), values['out-dir']);
  if (values.junit) {
    await writeJUnitReport(results, outDir);
  }
  if (values.markdown) {
    await writeMarkdownReport(results, outDir);
  }

  if (hasErrors) {
    console.warn('⚠️  Einige Sigillin-Dateien sind fehlgeschlagen – siehe Report für Details.');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('sigillins-report failed:', error);
  process.exit(1);
});
