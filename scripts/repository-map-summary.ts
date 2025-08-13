#!/usr/bin/env ts-node
/**
 * scripts/repository-map-summary.ts
 *
 * Small utility that prints a summary of modules defined in
 * `repositorypflege/repository_map.yaml`.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const file = path.join(__dirname, '../repositorypflege/repository_map.yaml');

export interface SummaryOptions {
  json?: boolean;
}

export function summarizeRepositoryMap(options: SummaryOptions = {}) {
  const raw = fs.readFileSync(file, 'utf8');
  const data = yaml.load(raw) as any;

  const items = Array.isArray(data.repository_map) ? data.repository_map : [];
  const summary: Record<string, number> = {};
  items.forEach((item: any) => {
    const name = item.name || 'unnamed';
    const modules = Array.isArray(item.modules) ? item.modules.length : 0;
    summary[name] = modules;
  });

  if (options.json) {
    return summary;
  }

  return Object.entries(summary)
    .map(([name, count]) => `${name}: ${count} module(s)`)
    .join('\n');
}

if (require.main === module) {
  const jsonFlag = process.argv.includes('--json');
  const result = summarizeRepositoryMap({ json: jsonFlag });
  if (jsonFlag) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(result);
  }
}

