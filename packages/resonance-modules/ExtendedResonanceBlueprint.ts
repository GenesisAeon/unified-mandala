export interface ResonanceService {
  name: string;
  endpoint: string;
}

export function createExtendedResonanceBlueprint(names: string[]): ResonanceService[] {
  return names.map((n) => ({
    name: n,
    endpoint: `/resonance/${n.toLowerCase()}`
  }));
}
