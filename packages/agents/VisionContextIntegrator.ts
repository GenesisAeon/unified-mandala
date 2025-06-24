export interface VisionContextResult {
  summary: string;
}

export class VisionContextIntegrator {
  constructor(private baseDir: string) {}

  loadStrategy(): string {
    const fs = require('fs');
    const path = require('path');
    const file = path.join(this.baseDir, 'docs/agents/AgentStrategy.md');
    return fs.readFileSync(file, 'utf-8');
  }

  summarize(): VisionContextResult {
    const content = this.loadStrategy();
    const lines = content.split('\n').slice(0, 5).join(' ');
    return { summary: lines.trim() };
  }
}
