export interface MemoryEntry {
  id: string;
  data: string;
  timestamp: number;
}

export class MemoryMeshSystem {
  private store: Record<string, MemoryEntry[]> = {};

  add(module: string, entry: MemoryEntry): void {
    if (!this.store[module]) this.store[module] = [];
    this.store[module].push(entry);
  }

  query(module: string): MemoryEntry[] {
    return this.store[module] ? [...this.store[module]] : [];
  }

  modules(): string[] {
    return Object.keys(this.store);
  }
}
