export class MemoryGovernance {
  private memory: Map<string, string> = new Map();

  set(key: string, value: string) {
    this.memory.set(key, value);
  }

  get(key: string): string | undefined {
    return this.memory.get(key);
  }

  delete(key: string): boolean {
    return this.memory.delete(key);
  }

  has(key: string): boolean {
    return this.memory.has(key);
  }

  entries(): [string, string][] {
    return Array.from(this.memory.entries());
  }

  clear() {
    this.memory.clear();
  }
}
