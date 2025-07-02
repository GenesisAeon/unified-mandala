export class PredictiveAnalyticsAgent {
  predict(data: number[]): number {
    return data.length ? data[data.length - 1] : 0;
  }
}
