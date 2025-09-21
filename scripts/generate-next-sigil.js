#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sigilPath = join(scriptDir, '../codex-sigil.yaml');

function loadSource() {
  return readFileSync(sigilPath, 'utf8');
}

function parseSigilMeta(source) {
  const anchorMatch = source.match(/^anchor:\s*(.+)$/m);
  const descMatch = source.match(/description:\s*>\n([\s\S]*?)\n(?:instructions:|$)/);
  const instructionsMatch = source.match(/instructions:\n([\s\S]*?)(?:\n\w|$)/);

  const baseAnchor = anchorMatch ? anchorMatch[1].trim() : 'unifiedmandala';
  const description = descMatch ? descMatch[1].trim() : '';
  const instructions = instructionsMatch
    ? instructionsMatch[1]
        .split('\n')
        .map((line) => line.replace(/^\s*-\s*/, ''))
        .filter(Boolean)
    : [];

  return { baseAnchor, description, instructions };
}

function yamlString(record) {
  return Object.entries(record)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return `${key}: []`;
        return `${key}:\n${value.map((item) => `  - ${item}`).join('\n')}`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');
}

function buildSigilRecord() {
  const { baseAnchor, description, instructions } = parseSigilMeta(loadSource());
  const timestamp = new Date().toISOString().slice(0, 10);
  return {
    record: {
      anchor: `${baseAnchor}-${timestamp}`,
      description,
      updated_from: baseAnchor,
      update_time: timestamp,
      responsible: process.env.USER || process.env.USERNAME || 'unknown',
      instructions,
    },
    timestamp,
  };
}

function writeSigil() {
  const { record, timestamp } = buildSigilRecord();
  const outDir = join(scriptDir, '../docs/sigils');
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  const outFile = join(outDir, `${timestamp}-next-sigil.yaml`);
  writeFileSync(outFile, `# Auto-generated sigil\n${yamlString(record)}\n`);
  console.log(`New sigil written to ${outFile}`);
}

writeSigil();
