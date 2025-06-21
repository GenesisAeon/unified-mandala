export interface ResonanceProfile {
  resonanceScore: number;
  count: number;
}

export class AeonResonanceInsights {
  compute(logs: string[]): ResonanceProfile {
    const resonanceMessages = logs.filter(m => /resonanz/i.test(m));
    const resonanceScore = resonanceMessages.reduce((sum, msg) => sum + msg.length, 0);
    return { resonanceScore, count: resonanceMessages.length };
  }
}
