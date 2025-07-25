import { MemoryManager, MemoryCategory } from '../memory-manager';

export class MemoryGovernanceService {
  constructor(private manager = new MemoryManager()) {}

  enforceLimit(category: MemoryCategory, maxEntries: number) {
    const entries = this.manager.get(category);
    if (entries.length > maxEntries) {
      this.manager["cleanup"](category as any);
    }
  }
}
