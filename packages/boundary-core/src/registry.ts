import type { BoundaryRule } from './types';

export class BoundaryRegistry {
  private rules = new Map<string, BoundaryRule>();

  register(rule: BoundaryRule): BoundaryRule {
    this.rules.set(rule.id, rule);
    return rule;
  }

  registerMany(rules: BoundaryRule[]): this {
    rules.forEach((r) => this.register(r));
    return this;
  }

  list(): BoundaryRule[] {
    return Array.from(this.rules.values());
  }

  get(id: string): BoundaryRule | null {
    return this.rules.get(id) ?? null;
  }

  byTag(tag: string): BoundaryRule[] {
    return this.list().filter((r) => (r.tags || []).includes(tag));
  }
}

export default BoundaryRegistry;

