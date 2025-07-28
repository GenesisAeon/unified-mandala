export interface Scenario {
  id: string;
  probability: number;
}

export function planNext(scenarios: Scenario[]): Scenario {
  return scenarios.sort((a,b)=>b.probability-a.probability)[0];
}
