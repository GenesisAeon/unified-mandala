/**
 * Minimal reinforcement learning agent with a Q-table.
 * CSO (contextual self-optimization) is represented as simple
 * reward-based updates without external dependencies.
 */
export class RLCSOAgent {
  private q: Record<string, number> = {};

  selectAction(state: string, actions: string[]): string {
    let best = actions[0];
    let bestQ = this.q[`${state}:${best}`] ?? 0;
    for (const action of actions) {
      const q = this.q[`${state}:${action}`] ?? 0;
      if (q > bestQ) {
        bestQ = q;
        best = action;
      }
    }
    return best;
  }

  update(state: string, action: string, reward: number): void {
    const key = `${state}:${action}`;
    const q = this.q[key] ?? 0;
    // simple incremental update
    this.q[key] = q + 0.1 * (reward - q);
  }
}

export default RLCSOAgent;
