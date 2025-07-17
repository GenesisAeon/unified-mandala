export interface BoundaryRule {
  id: string;
  description: string;
}

export class BoundaryPrototype {
  private rules: BoundaryRule[] = [];

  addRule(rule: BoundaryRule) {
    this.rules.push(rule);
  }

  listRules(): BoundaryRule[] {
    return this.rules;
  }
}
