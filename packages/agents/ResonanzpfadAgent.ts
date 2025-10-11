export interface ResonanzpfadReport {
  archetypeHits: number;
  resonanceScore: number;
}

export class ResonanzpfadAgent {
  analyze(logs: string[]): ResonanzpfadReport {
    const archetypeHits = logs.filter((l) => /archetyp/i.test(l)).length;
    const resonanceMessages = logs.filter((l) => /resonanz/i.test(l));
    const resonanceScore = resonanceMessages.reduce((s, m) => s + m.length, 0);
    return { archetypeHits, resonanceScore };
  }
}
