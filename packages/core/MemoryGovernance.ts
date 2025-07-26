export class MemoryGovernance {
  private memory: Map<string, string> = new Map();

  set(key: string, value: string) {
    this.memory.set(key, value);
  }

  get(key: string): string | undefined {
    return this.memory.get(key);
  }
}
