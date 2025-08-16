export class PredictiveAnalyticsAgent {
  predict(data: number[]): number {
    if (data.length === 0) return 0;
    if (data.length === 1) return data[0];

    const deltas = data.slice(1).map((v, i) => v - data[i]);
    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    return data[data.length - 1] + avgDelta;
  }
}
