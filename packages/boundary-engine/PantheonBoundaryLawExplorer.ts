export interface PantheonBoundary {
  module: string;
  law: string;
}

export class PantheonBoundaryLawExplorer {
  explore(boundaries: PantheonBoundary[]): Record<string, number> {
    const counts = new Map<string, number>();
    for (const b of boundaries) {
      counts.set(b.law, (counts.get(b.law) || 0) + 1);
    }
    return Object.fromEntries(counts);
  }
}
