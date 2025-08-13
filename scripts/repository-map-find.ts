#!/usr/bin/env ts-node
/**
 * scripts/repository-map-find.ts
 *
 * Utility to locate repositories referencing a given module in
 * `repositorypflege/repository_map.yaml`.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const file = path.join(__dirname, '../repositorypflege/repository_map.yaml');

export function findRepositoriesByModule(moduleName: string): string[] {
  if (!moduleName) return [];

  const raw = fs.readFileSync(file, 'utf8');
  const data = yaml.load(raw) as any;
  const items = Array.isArray(data.repository_map) ? data.repository_map : [];

  return items
    .filter((item: any) => Array.isArray(item.modules) && item.modules.includes(moduleName))
    .map((item: any) => item.name || 'unnamed');
}

if (require.main === module) {
  const moduleName = process.argv[2];
  if (!moduleName) {
    console.error('Usage: ts-node repository-map-find.ts <module>');
    process.exit(1);
  }

  const repos = findRepositoriesByModule(moduleName);
  if (repos.length === 0) {
    console.log(`No repositories reference module '${moduleName}'.`);
  } else {
    repos.forEach((r) => console.log(r));
  }
}
