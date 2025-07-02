import fs from 'fs';
import path from 'path';

const REGISTRY_PATH = path.join(process.cwd(), 'plugins', 'registry.json');

export interface RegistryEntry {
  approved?: boolean;
  blacklisted?: boolean;
  versionLock?: string | null;
}

export function readRegistry(): Record<string, RegistryEntry> {
  if (!fs.existsSync(REGISTRY_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')) as Record<string, RegistryEntry>;
  } catch {
    return {};
  }
}

export function writeRegistry(reg: Record<string, RegistryEntry>) {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2));
}
