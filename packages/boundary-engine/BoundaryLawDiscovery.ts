export interface BoundaryRule {
  id: string;
  description: string;
  type?: string;
}

export class BoundaryLawDiscovery {
  discover(rules: BoundaryRule[]): string[] {
    const freq = new Map<string, number>();
    for (const rule of rules) {
      const key = rule.type || rule.description.split(/\s+/)[0];
      freq.set(key, (freq.get(key) || 0) + 1);
    }
    const laws: string[] = [];
    for (const [key, count] of freq.entries()) {
      if (count > 1) {
        laws.push(`${key}-law-${count}`);
      }
    }
    return laws;
  }
}
