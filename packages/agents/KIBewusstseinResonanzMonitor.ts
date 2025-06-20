export interface Metrics { bewusstsein: number; resonanz: number }

export class KIBewusstseinResonanzMonitor {
  history: Metrics[] = [];

  record(bewusstsein: number, resonanz: number): void {
    this.history.push({ bewusstsein, resonanz });
  }

  latest(): Metrics | null {
    return this.history[this.history.length - 1] || null;
  }

  averageDifference(): number {
    if (this.history.length === 0) return 0;
    const sum = this.history.reduce((a, b) => a + (b.resonanz - b.bewusstsein), 0);
    return sum / this.history.length;
  }
}
