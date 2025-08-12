import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface RepositoryEntry {
  name: string;
  type: string;
  role: string;
  modules: unknown;
}

export function validateRepositoryMap(filePath: string): void {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(raw) as { repository_map?: RepositoryEntry[] };
  if (!data || !Array.isArray(data.repository_map)) {
    throw new Error('repository_map root missing or invalid');
  }
  data.repository_map.forEach((repo, idx) => {
    ['name', 'type', 'role', 'modules'].forEach((key) => {
      if (!(key in repo)) {
        throw new Error(`Entry ${idx} missing required field: ${key}`);
      }
    });
  });
}

if (require.main === module) {
  const file = process.argv[2] || path.join(__dirname, '../repositorypflege/repository_map.yaml');
  try {
    validateRepositoryMap(file);
    console.log('repository_map.yaml is valid');
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}
