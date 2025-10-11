export interface CoordinatedAgent {
  id: string;
  priority?: number;
  /** Minimum CREP required to run this agent */
  minCrep?: number;
  /** Execute only when symbolzeit is divisible by this number */
  symbolzeitInterval?: number;
  run: (symbolzeit: number, crep: number) => Promise<void>;
}

export class AgentCoordinator {
  constructor(private agents: CoordinatedAgent[] = []) {}

  register(agent: CoordinatedAgent) {
    this.agents.push(agent);
  }

  async coordinate(symbolzeit: number, crep: number) {
    const sorted = [...this.agents].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    for (const a of sorted) {
      const meetsCrep = a.minCrep === undefined || crep >= a.minCrep;
      const meetsSymbolzeit =
        a.symbolzeitInterval === undefined ||
        (a.symbolzeitInterval > 0 && symbolzeit % a.symbolzeitInterval === 0);
      if (meetsCrep && meetsSymbolzeit) {
        await a.run(symbolzeit, crep);
      }
    }
  }
}
