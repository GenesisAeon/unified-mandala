#!/usr/bin/env ts-node
/**
 * scripts/repository-map-html.ts
 *
 * Render repositorypflege/repository_map.yaml as an HTML table.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface RepositoryEntry {
  name: string;
  modules?: string[];
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function repositoryMapToHtml(mapPath = path.join(__dirname, '../repositorypflege/repository_map.yaml')): string {
  const raw = fs.readFileSync(mapPath, 'utf8');
  const data = yaml.load(raw) as { repository_map?: RepositoryEntry[] };
  const repos = data.repository_map || [];

  const rows = repos.map((repo) => {
    const modules = (repo.modules || []).map((m) => escapeHtml(String(m))).join('<br>');
    return `<tr><td>${escapeHtml(repo.name)}</td><td>${modules}</td></tr>`;
  });

  return [
    '<table>',
    '<thead><tr><th>Repository</th><th>Modules</th></tr></thead>',
    '<tbody>',
    ...rows,
    '</tbody>',
    '</table>',
  ].join('\n');
}

if (require.main === module) {
  console.log(repositoryMapToHtml());
}
