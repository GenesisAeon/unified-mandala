export class SelfReflectionAgent {
  private logs: string[] = [];

  constructor(private readonly governance?: import('../core/MemoryGovernance').MemoryGovernance) {}

  record(message: string) {
    this.logs.push(message);
  }

  summarize(): string {
    return this.logs.join('\n');
  }

  reflectMemory(pattern: RegExp): string[] {
    if (!this.governance) return [];
    const flagged: string[] = [];
    for (const [key, value] of this.governance.entries()) {
      if (pattern.test(value)) {
        flagged.push(key);
      }
    }
    return flagged;
  }
}
