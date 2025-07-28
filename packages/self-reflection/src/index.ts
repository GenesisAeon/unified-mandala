export class SelfReflectionAgent {
  private logs: string[] = [];

  record(message: string) {
    this.logs.push(message);
  }

  reflect(): string {
    return this.logs.join('\n');
  }

  summary() {
    return {
      entries: this.logs.length,
      lastEntry: this.logs[this.logs.length - 1] ?? null,
    };
  }

  clear() {
    this.logs = [];
  }
}
