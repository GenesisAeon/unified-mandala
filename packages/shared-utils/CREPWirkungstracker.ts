import { CREPEntry } from '../crep-engine/types';

export interface CREPEffect {
  timestamp: Date;
  value: number;
}

export class CREPWirkungstracker {
  private history: CREPEffect[] = [];

  addEntry(entry: CREPEntry) {
    const value = (entry.C + entry.R + entry.E + entry.P) / 4;
    this.history.push({ timestamp: new Date(entry.timestamp), value });
  }

  getHistory() {
    return this.history;
  }

  getAverage(lastN = this.history.length): number {
    const slice = this.history.slice(-lastN);
    if (!slice.length) return 0;
    const sum = slice.reduce((acc, e) => acc + e.value, 0);
    return sum / slice.length;
  }
}
