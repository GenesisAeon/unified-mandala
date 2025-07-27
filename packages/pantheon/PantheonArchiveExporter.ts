import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

export interface ArchiveData {
  modules: string[];
}

function collectModules(): string[] {
  const dir = __dirname;
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts') && f !== 'PantheonArchiveExporter.ts')
    .map(f => f.replace(/\.ts$/, ''));
}

export function exportPantheonArchive(outFile: string, format: 'json' | 'yaml' | 'graph' = 'json'): ArchiveData {
  const modules = collectModules();
  const data: ArchiveData = { modules };

  let content: string;
  if (format === 'yaml') {
    content = YAML.stringify(data);
  } else if (format === 'graph') {
    const graph = { nodes: modules.map(m => ({ id: m })), edges: [] as any[] };
    content = JSON.stringify(graph, null, 2);
  } else {
    content = JSON.stringify(data, null, 2);
  }

  fs.writeFileSync(outFile, content);
  return data;
}
