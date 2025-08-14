#!/usr/bin/env ts-node
/**
 * scripts/repository-map-check-duplicates.ts
 *
 * Utility to detect duplicate repository names and module paths in
 * `repositorypflege/repository_map.yaml`.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const defaultFile = path.join(__dirname, '../repositorypflege/repository_map.yaml');

export interface DuplicateResult {
  duplicateRepos: string[];
  duplicateModules: string[];
}

export function findDuplicates(mapFile: string = defaultFile): DuplicateResult {
  const raw = fs.readFileSync(mapFile, 'utf8');
  const data = yaml.load(raw) as any;
  const items = Array.isArray(data?.repository_map) ? data.repository_map : [];

  const repoNames = new Map<string, number>();
  const modulePaths = new Map<string, number>();

  items.forEach((item: any) => {
    const name = String(item.name);
    repoNames.set(name, (repoNames.get(name) ?? 0) + 1);
    const modules: string[] = Array.isArray(item.modules) ? item.modules : [];
    modules.forEach((m) => {
      modulePaths.set(m, (modulePaths.get(m) ?? 0) + 1);
    });
  });

  const duplicateRepos = Array.from(repoNames.entries())
    .filter(([, count]) => count > 1)
    .map(([name]) => name);
  const duplicateModules = Array.from(modulePaths.entries())
    .filter(([, count]) => count > 1)
    .map(([mod]) => mod);

  return { duplicateRepos, duplicateModules };
}

if (require.main === module) {
  const { duplicateRepos, duplicateModules } = findDuplicates();
  if (duplicateRepos.length === 0 && duplicateModules.length === 0) {
    console.log('No duplicates found');
  } else {
    if (duplicateRepos.length > 0) {
      console.error('Duplicate repositories:');
      duplicateRepos.forEach((r) => console.error(r));
    }
    if (duplicateModules.length > 0) {
      console.error('Duplicate modules:');
      duplicateModules.forEach((m) => console.error(m));
    }
    process.exit(1);
  }
}
