export interface PhiProfile {
  phi: number;
  timestamp: number;
}

export class NucleonScanner {
  history: PhiProfile[] = [];

  logPhi(phi: number) {
    this.history.push({ phi, timestamp: Date.now() });
  }

  averagePhi(): number {
    if (this.history.length === 0) return 0;
    const sum = this.history.reduce((a, b) => a + b.phi, 0);
    return sum / this.history.length;
  }
}
