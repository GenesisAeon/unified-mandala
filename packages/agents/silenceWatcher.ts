import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export class SilenceWatcher {
  private lastEvent = Date.now();
  private handler = () => {
    this.lastEvent = Date.now();
  };

  constructor(private thresholdMs = 60000, private hub = GPTEventHub) {
    this.hub.on('*', this.handler as any);
  }

  shouldAnalyze(): boolean {
    return Date.now() - this.lastEvent > this.thresholdMs;
  }

  stop(): void {
    this.hub.off('*', this.handler as any);
  }
}
