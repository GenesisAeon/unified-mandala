import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
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
  // ESM/CJS-agnostisch importieren
  const mod = await import(pathToFileURL(full).href).catch(async () => require(full));
  // @ts-ignore
  return mod.default || mod.agent || mod;
  function pathToFileURL(p: string) {
    const u = new URL('file:');
    const abs = path.resolve(p).replace(/\\/g, '/');
    if (!abs.startsWith('/')) {
      u.pathname = '/' + abs;
    } else {
      u.pathname = abs;
    }
    return u;
  }
}
