export class SilenceWatcher {
  private last: number;
  constructor(private thresholdMs = 60000, private now: () => number = () => Date.now()) {
    this.last = this.now();
  }
  record() {
    this.last = this.now();
  }
  shouldAnalyze(): boolean {
    return this.now() - this.last > this.thresholdMs;
  }
}
