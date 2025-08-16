#!/usr/bin/env ts-node
/**
 * scripts/repository-map-export-csv.ts
 *
 * Export repository_map.yaml entries to CSV listing repository-module pairs.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const file = path.join(__dirname, '../repositorypflege/repository_map.yaml');

export function exportRepositoryMapCSV(): string {
  const raw = fs.readFileSync(file, 'utf8');
  const data = yaml.load(raw) as any;
  const items = Array.isArray(data.repository_map) ? data.repository_map : [];
  const rows: string[][] = [['repository', 'module']];

  items.forEach((item: any) => {
    const repo = item.name || '';
    const modules = Array.isArray(item.modules) ? item.modules : [];
    if (modules.length === 0) {
      rows.push([repo, '']);
    } else {
      modules.forEach((m: any) => rows.push([repo, String(m)]));
    }
  });

  return rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

if (require.main === module) {
  console.log(exportRepositoryMapCSV());
}
