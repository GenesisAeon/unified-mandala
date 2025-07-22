export interface BoundaryMatch {
  rule: string;
  occurrences: number;
}

export function detectBoundary(rules: (string | RegExp)[], text: string): BoundaryMatch[] {
  return rules
    .map(rule => {
      const pattern = typeof rule === 'string' ? new RegExp(rule, 'gi') : rule;
      const matches = text.match(pattern);
      if (!matches) return null;
      return { rule: pattern.source, occurrences: matches.length } as BoundaryMatch;
    })
    .filter((m): m is BoundaryMatch => Boolean(m));
}
