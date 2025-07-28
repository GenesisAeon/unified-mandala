export interface Scenario {
  universeId: string;
  parameters: Record<string, number>;
}

export class MultiverseScenarioPlanner {
  private scenarios: Scenario[] = [];

  addScenario(s: Scenario) {
    this.scenarios.push(s);
  }

  count(): number {
    return this.scenarios.length;
  }
}
