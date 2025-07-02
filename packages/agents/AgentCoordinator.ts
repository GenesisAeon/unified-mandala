export interface CoordinatedAgent {
  id: string;
  priority?: number;
  run: (symbolzeit: number, crep: number) => Promise<void>;
}

export class AgentCoordinator {
  constructor(private agents: CoordinatedAgent[] = []) {}

  register(agent: CoordinatedAgent) {
    this.agents.push(agent);
  }

  async coordinate(symbolzeit: number, crep: number) {
    const sorted = [...this.agents].sort((a,b)=>(b.priority||0)-(a.priority||0));
    for (const a of sorted) {
      if (crep >= 0.5) {
        await a.run(symbolzeit, crep);
      }
    }
  }
}
