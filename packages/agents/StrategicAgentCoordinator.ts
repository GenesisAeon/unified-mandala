import fs from 'fs';
import path from 'path';

export class StrategicAgentCoordinator {
  constructor(private baseDir: string = '.') {}

  listAgents(): string[] {
    const agentsFile = path.join(this.baseDir, 'AGENTS.md');
    const content = fs.readFileSync(agentsFile, 'utf-8');
    const regex = /^## .* Agent: ([A-Za-z0-9]+)/gm;
    const agents: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      agents.push(match[1]);
    }
    return agents;
  }

  synchronize(outputFile: string = 'strategy-overview.json'): void {
    const agents = this.listAgents();
    const file = path.join(this.baseDir, outputFile);
    fs.writeFileSync(file, JSON.stringify({ agents }, null, 2), 'utf-8');
  }
}
