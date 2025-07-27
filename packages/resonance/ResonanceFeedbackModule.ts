export class ResonanceFeedbackModule {
  private feedback: number[] = [];

  addFeedback(score: number) {
    this.feedback.push(score);
  }

  average(): number {
    if (this.feedback.length === 0) {
      return 0;
    }
    const sum = this.feedback.reduce((a, b) => a + b, 0);
    return sum / this.feedback.length;
  }
}
