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

try {
  const raw = fs.readFileSync(file, 'utf8');
  const data = yaml.load(raw) as any;

  const items = Array.isArray(data.repository_map) ? data.repository_map : [];
  items.forEach((item: any) => {
    const name = item.name || 'unnamed';
    const modules = Array.isArray(item.modules) ? item.modules.length : 0;
    console.log(`${name}: ${modules} module(s)`);
  });
} catch (err) {
  console.error('Failed to read repository map:', err);
  process.exit(1);
}

