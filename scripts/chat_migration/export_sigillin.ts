import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface ExportOptions {
  memoryPath?: string;
  outJsonPath?: string;
  outYamlPath?: string;
}

async function collectSigils(dir: string, base: string): Promise<any[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results: any[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await collectSigils(full, base));
    } else if (entry.isFile()) {
      if (/conversations/i.test(entry.name)) continue;
      const rel = path.relative(base, full);
      if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) {
        const data = yaml.load(await fs.readFile(full, 'utf8'));
        results.push({ file: rel, data });
      } else if (entry.name.endsWith('.json')) {
        const data = JSON.parse(await fs.readFile(full, 'utf8'));
        results.push({ file: rel, data });
      }
    }
  }
  return results;
}

export async function exportSigillin(options: ExportOptions = {}) {
  const memoryPath = options.memoryPath || path.resolve('docs/sigils');
  const outJsonPath = options.outJsonPath || path.resolve('scripts/chat_migration/exported_sigillin.json');
  const outYamlPath = options.outYamlPath || path.resolve('scripts/chat_migration/exported_sigillin.yaml');

  const sigils = await collectSigils(memoryPath, memoryPath);

  await fs.mkdir(path.dirname(outJsonPath), { recursive: true });
  await fs.writeFile(outJsonPath, JSON.stringify(sigils, null, 2));
  await fs.writeFile(outYamlPath, yaml.dump(sigils));

  return sigils;
}

if (require.main === module) {
  exportSigillin().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
