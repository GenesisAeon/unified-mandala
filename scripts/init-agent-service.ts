import fs from 'fs';
import path from 'path';

export function camelCase(name: string): string {
  return name
    .replace(/[-_]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (m) => m.toLowerCase());
}

export function initAgentService(name: string, baseDir = 'packages'): string {
  const dir = path.join(baseDir, name);
  fs.mkdirSync(dir, { recursive: true });
  const indexPath = path.join(dir, 'index.ts');
  if (!fs.existsSync(indexPath)) {
    const id = camelCase(name);
    fs.writeFileSync(indexPath, `export const ${id} = () => 'initialized';\n`);
  }
  return dir;
}

if (require.main === module) {
  const [name, base] = process.argv.slice(2);
  if (!name) {
    console.error('Usage: ts-node init-agent-service.ts <name> [baseDir]');
    process.exit(1);
  }
  console.log(initAgentService(name, base));
}
