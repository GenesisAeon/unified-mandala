export interface NavigatorOptions {
  instructionsPath: string;
  agentsPath: string;
}

export class CodexNavigatorAgent {
  constructor(private options: NavigatorOptions) {}

  parseInstructions(): string[] {
    const data = require('fs').readFileSync(this.options.instructionsPath, 'utf-8');
    return data.split('\n').filter(Boolean);
  }

  parseAgents(): string[] {
    const data = require('fs').readFileSync(this.options.agentsPath, 'utf-8');
    return data.split('\n').filter((line: string) => line.startsWith('##'));
  }
}
