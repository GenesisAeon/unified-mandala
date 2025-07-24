export class ResonanceFeedbackModule {
  private feedback: number[] = [];

  record(value: number) {
    this.feedback.push(value);
  }

  average(): number {
    if (this.feedback.length === 0) return 0;
    return this.feedback.reduce((a, b) => a + b, 0) / this.feedback.length;
  }
}
