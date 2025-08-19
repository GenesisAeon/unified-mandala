export class PantheonPortalAnalytics {
  private visits = 0;
  private events: Record<string, number> = {};
  private crepTotals = {
    coherence: 0,
    resonance: 0,
    emergence: 0,
    poetics: 0,
  };
  private crepCount = 0;
  private fourierPeaks: number[] = [];

  recordVisit() {
    this.visits += 1;
  }

  recordEvent(name: string) {
    this.events[name] = (this.events[name] || 0) + 1;
  }

  recordFourierPeak(peak: number) {
    this.fourierPeaks.push(peak);
  }

  recordCREP(metrics: {
    coherence: number;
    resonance: number;
    emergence: number;
    poetics: number;
  }) {
    this.crepTotals.coherence += metrics.coherence;
    this.crepTotals.resonance += metrics.resonance;
    this.crepTotals.emergence += metrics.emergence;
    this.crepTotals.poetics += metrics.poetics;
    this.crepCount += 1;
  }

  private getOutcomeKPIs() {
    if (this.crepCount === 0) {
      return { ...this.crepTotals };
    }
    return {
      coherence: this.crepTotals.coherence / this.crepCount,
      resonance: this.crepTotals.resonance / this.crepCount,
      emergence: this.crepTotals.emergence / this.crepCount,
      poetics: this.crepTotals.poetics / this.crepCount,
    };
  }

  getStats() {
    return {
      visits: this.visits,
      events: { ...this.events },
      outcomeKPIs: this.getOutcomeKPIs(),
      fourierPeaks: [...this.fourierPeaks],
    };
  }
}
