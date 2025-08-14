export class RealTimePerformanceMonitor {
  private metrics: number[] = [];
  record(v: number) { this.metrics.push(v); }
  average() {
    return this.metrics.length ? this.metrics.reduce((a,b)=>a+b,0)/this.metrics.length : 0;
  }
  exceedsThreshold(threshold: number) {
    return this.average() > threshold;
  }
}
