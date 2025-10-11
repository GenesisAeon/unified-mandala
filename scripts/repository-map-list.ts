#!/usr/bin/env ts-node
/**
 * scripts/repository-map-list.ts
 *
 * Utility to list all repositories and their modules from
 * `repositorypflege/repository_map.yaml`.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const file = path.join(__dirname, '../repositorypflege/repository_map.yaml');

export interface ListOptions {
  json?: boolean;
}

export function listRepositoryMap(options: ListOptions = {}) {
  const raw = fs.readFileSync(file, 'utf8');
  const data = yaml.load(raw) as any;

  const items = Array.isArray((data as any).repository_map) ? (data as any).repository_map : [];
  const result: Record<string, string[]> = {};

  items.forEach((item: any) => {
    const name = item.name || 'unnamed';
    const modules = Array.isArray(item.modules) ? item.modules : [];
    result[name] = modules.map((m: any) => String(m));
  });

  if (options.json) {
    return result;
  }

  return Object.entries(result)
    .map(([repo, mods]) => `${repo}:\n  - ${mods.join('\n  - ')}`)
    .join('\n');
}

if (require.main === module) {
  const jsonFlag = process.argv.includes('--json');
  const output = listRepositoryMap({ json: jsonFlag });
  if (jsonFlag) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(output);
  }
}
