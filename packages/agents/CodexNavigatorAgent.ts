import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface NavigatorState {
  phase: string;
  resonanzpfad: Array<{ task: string; antwort: string }>;
}

export class CodexNavigatorAgent {
  private instruction: any;
  private agents: string;
  private work: any;
  public state: NavigatorState = { phase: 'init', resonanzpfad: [] };

  constructor(private codexDir: string) {
    this.instruction = this.readYAML('codexinstructions.yaml');
    this.agents = this.readMarkdown('AGENTS.md');
    this.work = this.readYAML('codexwork.yaml');
  }

  private readYAML(filename: string): any {
    const file = path.join(this.codexDir, filename);
    const content = fs.readFileSync(file, 'utf-8');
    return yaml.load(content);
  }

  private readMarkdown(filename: string): string {
    const file = path.join(this.codexDir, filename);
    return fs.readFileSync(file, 'utf-8');
  }

  public explore(): void {
    const tasks = Array.isArray(this.work.tasks) ? this.work.tasks : [];
    for (const task of tasks) {
      const result = this.processTask(task);
      this.state.resonanzpfad.push(result);
      this.logResult(result);
    }
  }

  private processTask(task: any): { task: any; antwort: string } {
    return {
      task,
      antwort: `Resonanz aus Phase ${this.state.phase}`,
    };
  }

  private logResult(result: { task: any; antwort: string }): void {
    console.log(`\uD83C\uDF00 ${JSON.stringify(result.task)} \u2192 ${result.antwort}`);
  }
}
