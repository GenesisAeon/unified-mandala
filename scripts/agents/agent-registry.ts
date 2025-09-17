import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { pathToFileURL } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
export type RegistryEntry = { id: string; entry: string; description?: string };
export function loadRegistry(): RegistryEntry[] {
  const p = path.resolve(process.cwd(), 'agents/registry.yaml');
  if (!fs.existsSync(p)) return [];
  const { agents } = yaml.parse(fs.readFileSync(p, 'utf8')) || { agents: [] };
  return Array.isArray(agents) ? agents.filter((a) => a && a.id && a.entry) : [];
}
export async function loadAgentModule(entry: string) {
  const full = path.resolve(process.cwd(), entry);
  if (!fs.existsSync(full)) throw new Error(`agent_entry_not_found:${entry}`);
  try {
    const mod = await import(pathToFileURL(full).href);
    // @ts-ignore - dynamic module shape
    return mod.default || mod.agent || mod;
  } catch (err) {
    const mod = require(full);
    // @ts-ignore - dynamic module shape
    return mod.default || mod.agent || mod;
  }
}
