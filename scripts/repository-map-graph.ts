import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface RepositoryEntry {
  name: string;
  modules?: string[];
}

export function repositoryMapToDot(
  mapPath = path.join(__dirname, '../repositorypflege/repository_map.yaml'),
): string {
  const file = fs.readFileSync(mapPath, 'utf8');
  const data = yaml.load(file) as { repository_map: RepositoryEntry[] };
  const repos = data.repository_map || [];
  const lines: string[] = ['digraph RepositoryMap {'];
  for (const repo of repos) {
    const modules = repo.modules || [];
    for (const mod of modules) {
      lines.push(`  "${repo.name}" -> "${mod}";`);
    }
  }
  lines.push('}');
  return lines.join('\n');
}

if (require.main === module) {
  console.log(repositoryMapToDot());
}
