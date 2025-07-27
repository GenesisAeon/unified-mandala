export interface Scenario {
  name: string;
  probability: number;
}

export function listScenarios(): Scenario[] {
  return [
    { name: 'Default', probability: 1 },
    { name: 'Quantum Split', probability: 0.3 },
    { name: 'Anthropic Mirror', probability: 0.2 },
  ];
}
