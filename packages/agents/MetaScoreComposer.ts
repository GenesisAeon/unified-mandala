export interface MetaScore {
  layer: string;
  score: number;
}

export class MetaScoreComposer {
  aggregate(inputs: MetaScore[][]): MetaScore[] {
    const map: Record<string, number[]> = {};
    for (const list of inputs) {
      for (const item of list) {
        if (!map[item.layer]) map[item.layer] = [];
        map[item.layer].push(item.score);
      }
    }
    return Object.entries(map).map(([layer, scores]) => ({
      layer,
      score: scores.reduce((a, b) => a + b, 0) / scores.length,
    }));
  }

  detectConflicts(scores: MetaScore[]): boolean {
    return scores.some((s) => s.score < 0 || s.score > 1);
  }
}
