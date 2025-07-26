export interface Scenario {
  name: string;
  probability: number;
}

export function listScenarios(): Scenario[] {
  return [{ name: 'Default', probability: 1 }];
}
