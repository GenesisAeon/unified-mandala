export interface BoundaryRule {
  id: string;
  evaluate(input: unknown): boolean;
}

export class BoundaryLawSimulator {
  private rules: BoundaryRule[];

  constructor(rules: BoundaryRule[] = []) {
    this.rules = rules;
  }

  addRule(rule: BoundaryRule) {
    this.rules.push(rule);
  }

  simulate(input: unknown) {
    return this.rules.map(r => ({ ruleId: r.id, result: r.evaluate(input) }));
  }
}
