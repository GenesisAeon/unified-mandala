export class DebounceManager {
  private timers: Map<string, NodeJS.Timeout> = new Map();
  constructor(private delay = 300) {}
  run(key: string, fn: () => void) {
    if (this.timers.has(key)) clearTimeout(this.timers.get(key));
    this.timers.set(
      key,
      setTimeout(() => {
        this.timers.delete(key);
        fn();
      }, this.delay)
    );
  }
}
