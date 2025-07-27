export class ResonanceFeedbackModule {
  private feedback: number[] = [];

  add(value: number): void {
    this.feedback.push(value);
  }

  metrics(): { average: number; variance: number } {
    const len = this.feedback.length;
    if (len === 0) return { average: 0, variance: 0 };
    const avg = this.feedback.reduce((a, b) => a + b, 0) / len;
    const variance = this.feedback.reduce((sum, v) => sum + (v - avg) ** 2, 0) / len;
    return { average: avg, variance };
  }
}
