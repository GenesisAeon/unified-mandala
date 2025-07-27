export interface FeedbackEntry {
  userId: string;
  value: number;
}

export class ResonanceFeedbackModule {
  private entries: FeedbackEntry[] = [];

  record(entry: FeedbackEntry): void {
    this.entries.push(entry);
  }

  average(): number {
    if (this.entries.length === 0) return 0;
    const sum = this.entries.reduce((a, b) => a + b.value, 0);
    return sum / this.entries.length;
  }
}
