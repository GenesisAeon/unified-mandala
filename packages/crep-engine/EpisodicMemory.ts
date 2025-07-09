export interface EpisodicEntry {
  timestamp: Date;
  C: number;
  R: number;
  E: number;
  P: number;
  symbol?: string;
}

export class EpisodicMemory {
  private memory: EpisodicEntry[] = [];

  add(entry: Omit<EpisodicEntry, 'timestamp'> & { timestamp?: Date }): void {
    this.memory.push({
      timestamp: entry.timestamp ?? new Date(),
      C: entry.C,
      R: entry.R,
      E: entry.E,
      P: entry.P,
      symbol: entry.symbol,
    });
  }

  getAll(): EpisodicEntry[] {
    return this.memory;
  }

  getLast(n: number): EpisodicEntry[] {
    return this.memory.slice(-n);
  }
}
