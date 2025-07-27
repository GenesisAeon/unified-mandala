export interface ResonanceFeedback {
  rating: number;
  comment?: string;
}

export class ResonanceFeedbackModule {
  private entries: ResonanceFeedback[] = [];

  addFeedback(entry: ResonanceFeedback): void {
    this.entries.push(entry);
  }

  getAverageRating(): number {
    if (this.entries.length === 0) return 0;
    const sum = this.entries.reduce((a, b) => a + b.rating, 0);
    return sum / this.entries.length;
  }

  clear(): void {
    this.entries = [];
  }
}
