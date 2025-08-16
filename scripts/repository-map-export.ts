#!/usr/bin/env ts-node
/**
 * scripts/repository-map-export.ts
 *
 * Utility to export `repositorypflege/repository_map.yaml` as JSON.
 * When run directly, it prints the JSON or writes it to a file provided via `--out`.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const defaultFile = path.join(__dirname, '../repositorypflege/repository_map.yaml');

export function exportRepositoryMap(file: string = defaultFile, outFile?: string) {
  const raw = fs.readFileSync(file, 'utf8');
  const data = yaml.load(raw);
  if (outFile) {
    fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
  }
  return data;
}

if (require.main === module) {
  const fileArg = process.argv.find((arg) => arg.endsWith('.yaml'));
  const outIndex = process.argv.indexOf('--out');
  const outPath = outIndex !== -1 ? process.argv[outIndex + 1] : undefined;
  const data = exportRepositoryMap(fileArg || defaultFile, outPath);
  if (!outPath) {
    console.log(JSON.stringify(data, null, 2));
  }
}
