import { compile } from './compiler';
import { Agent, Task } from '../core/interfaces';

export class AeonCoreAssembler {
  private agents: Agent[] = [];
  constructor(private allowedAgents: string[] = []) {}

  register(agent: Agent): void {
    if (this.allowedAgents.length && !this.allowedAgents.includes(agent.id)) {
      return;
    }
    this.agents.push(agent);
  }

  async processSource(source: string): Promise<void> {
    const result = compile(source);
    for (const task of result.tasks) {
      await this.dispatch(task);
    }
  }

  private async dispatch(task: Task): Promise<void> {
    for (const agent of this.agents) {
      await agent.handle(task);
    }
  }
}
