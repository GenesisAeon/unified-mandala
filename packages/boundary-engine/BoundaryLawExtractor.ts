import fs from 'fs';
import yaml from 'js-yaml';

export interface BoundaryLaw {
  name: string;
  system_1?: string;
  system_2?: string;
  domain?: string;
  signature?: string;
  emergent_effects?: string[];
  macro_recurrence?: string[];
}

export class BoundaryLawExtractor {
  constructor(private files: string[]) {}

  extract(): BoundaryLaw[] {
    const rules: BoundaryLaw[] = [];
    for (const file of this.files) {
      const text = fs.readFileSync(file, 'utf8');
      const matches = text.match(/```yaml[\s\S]*?boundary_rule:[\s\S]*?```/g);
      if (!matches) continue;
      for (const block of matches) {
        const clean = block.replace(/```yaml|```/g, '');
        const data = yaml.load(clean.trim()) as any;
        if (data && typeof data === 'object' && 'boundary_rule' in data) {
          rules.push(data.boundary_rule as BoundaryLaw);
        }
      }
    }
    return rules;
  }
}
