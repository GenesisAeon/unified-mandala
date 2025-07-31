import { Agent, Task } from '../core/interfaces';

export class AgentDispatcher {
  constructor(private agents: Agent[]) {}

  async dispatch(task: Task): Promise<void> {
    const sorted = [...this.agents].sort((a, b) => ((b as any).priority || 0) - ((a as any).priority || 0));
    for (const agent of sorted) {
      try {
        await agent.handle(task);
      } catch (err) {
        console.error('Agent error', err);
      }
    }
  }
}
