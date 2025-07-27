export interface FeedbackEntry {
  userId: string;
  score: number; // -1..1 resonance feedback
}

export class ResonanceFeedbackModule {
  private feedback: Map<string, number[]> = new Map();

  addFeedback(entry: FeedbackEntry) {
    const list = this.feedback.get(entry.userId) || [];
    list.push(entry.score);
    this.feedback.set(entry.userId, list);
  }

  getUserResonance(userId: string): number {
    const list = this.feedback.get(userId) || [];
    if (list.length === 0) return 0;
    return list.reduce((a, b) => a + b, 0) / list.length;
  }

  getGlobalResonance(): number {
    const allScores: number[] = [];
    for (const list of this.feedback.values()) {
      allScores.push(...list);
    }
    if (allScores.length === 0) return 0;
    return allScores.reduce((a, b) => a + b, 0) / allScores.length;
  }
}
