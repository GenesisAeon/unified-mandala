export interface BoundaryObservation {
  timestamp: number;
  data: unknown;
}

export interface BoundaryRule {
  id: string;
  description: string;
}

export class BoundaryDiscoveryAgent {
  private observations: BoundaryObservation[] = [];

  addObservation(obs: BoundaryObservation) {
    this.observations.push(obs);
  }

  discoverRules(): BoundaryRule[] {
    // naive example: one rule per observation
    return this.observations.map((o, idx) => ({
      id: `rule-${idx}`,
      description: `auto-generated from obs ${idx}`,
    }));
  }
}
