export interface CommonsMetrics {
  openAccess: number;
  dataShared: number;
  openMethods: number;
}

export class CommonsAgent {
  score(metrics: CommonsMetrics): number {
    const values = Object.values(metrics);
    const total = values.reduce((s, v) => s + v, 0);
    return values.length ? total / values.length : 0;
  }
}
