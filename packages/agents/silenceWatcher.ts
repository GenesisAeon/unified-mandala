import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export class SilenceWatcher {
  private last: number;
  constructor(private thresholdMs = 15000) {
    this.last = Date.now();
    GPTEventHub.on('*', () => { this.last = Date.now(); });
  }

  shouldAnalyze(): boolean {
    if (Date.now() - this.last > this.thresholdMs) {
      GPTEventHub.emit('orakel:says', { text: '… Stille spricht lauter als Worte.' });
      this.last = Date.now();
      return true;
    }
    return false;
  }

  start() {
    setInterval(() => this.shouldAnalyze(), this.thresholdMs / 2);
  }
}

export function silenceWatcher(thresholdMs = 15000) {
  const watcher = new SilenceWatcher(thresholdMs);
  watcher.start();
  return watcher;
}
