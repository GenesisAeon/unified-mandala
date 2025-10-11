import { promises as fs } from 'fs';
import path from 'path';

export interface ModuleStatus {
  name: string;
  path: string;
  exists: boolean;
}

const MODULES: { name: string; relPath: string }[] = [
  { name: 'Ethical Refusal', relPath: 'agents/ethics_policy/main.py' },
  { name: 'Singularity Simulator', relPath: 'agents/singularity_simulator/main.py' },
  { name: 'Weltinnenpolitik-Simulator', relPath: 'agents/governance_simulator/main.py' },
];

export async function initModules(): Promise<ModuleStatus[]> {
  const results: ModuleStatus[] = [];
  for (const mod of MODULES) {
    const full = path.resolve(mod.relPath);
    try {
      await fs.access(full);
      results.push({ name: mod.name, path: full, exists: true });
    } catch {
      results.push({ name: mod.name, path: full, exists: false });
    }
  }
  return results;
}

if (require.main === module) {
  initModules()
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
