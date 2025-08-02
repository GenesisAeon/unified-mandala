import fs from 'fs';
import path from 'path';
import { runDryAgent } from '../packages/shared-utils/runDryAgent';

function extractAgentNames(markdown: string): string[] {
  const regex = /Agent:\s*([A-Za-z0-9]+)/g;
  const names: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    names.push(match[1]);
  }
  return names;
}

const agentsPath = path.join(__dirname, '..', 'AGENTS.md');
const content = fs.readFileSync(agentsPath, 'utf8');
const names = extractAgentNames(content);

names.forEach((name) => {
  const logs = runDryAgent({ name, simulate: () => {} });
  logs.forEach((msg) => console.log(msg));
});
