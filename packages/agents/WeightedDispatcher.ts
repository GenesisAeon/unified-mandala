import { Agent, Task } from '../core/interfaces';

export class WeightedDispatcher {
  constructor(private agents: Agent[]) {}

  async dispatch(task: Task) {
    const sorted = this.agents.sort((a, b) => ((b as any).priority || 0) - ((a as any).priority || 0));
    for (const agent of sorted) await agent.handle(task);
  }
}
