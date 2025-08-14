#!/usr/bin/env ts-node
/**
 * scripts/repository-map-check-modules.ts
 *
 * Utility to verify that module paths referenced in
 * `repositorypflege/repository_map.yaml` exist in the repository.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const repoRoot = path.join(__dirname, '..');
const defaultFile = path.join(__dirname, '../repositorypflege/repository_map.yaml');

export function findMissingModules(mapFile: string = defaultFile): string[] {
  const raw = fs.readFileSync(mapFile, 'utf8');
  const data = yaml.load(raw) as any;
  const items = Array.isArray(data?.repository_map) ? data.repository_map : [];

  const missing: string[] = [];
  items.forEach((item: any) => {
    const modules: string[] = Array.isArray(item.modules) ? item.modules : [];
    modules.forEach((m) => {
      const filePath = path.join(repoRoot, m);
      if (!fs.existsSync(filePath)) {
        missing.push(m);
      }
    });
  });

  return missing;
}

if (require.main === module) {
  const missing = findMissingModules();
  if (missing.length === 0) {
    console.log('All modules exist');
  } else {
    console.error('Missing modules:');
    missing.forEach((m) => console.error(m));
    process.exit(1);
  }
}
