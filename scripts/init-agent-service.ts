import fs from 'fs';
import path from 'path';

export function createAgentService(name: string, baseDir = 'packages/pantheon/agents'): string {
  const className = name.replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^[a-z]/, c => c.toUpperCase());
  const dir = path.join(baseDir, name);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'index.ts');
  const content = `export class ${className} {\n  constructor() {}\n  init() {\n    // TODO: implement agent logic\n  }\n}\n`;
  fs.writeFileSync(filePath, content);
  return filePath;
}

if (require.main === module) {
  const [name] = process.argv.slice(2);
  if (!name) {
    console.error('Usage: ts-node init-agent-service.ts <AgentName>');
    process.exit(1);
  }
  const created = createAgentService(name);
  console.log(`Created ${created}`);
}
