import { MemoryManager, MemoryCategory } from '../memory-manager';

export class MemoryGovernanceService {
  constructor(private manager = new MemoryManager()) {}

  enforceLimit(category: MemoryCategory, maxEntries: number) {
    const entries = this.manager.get(category);
    if (entries.length > maxEntries) {
      this.manager["cleanup"](category as any);
    }
  }

  detectTrauma(category: MemoryCategory): string[] {
    const traumaRegex = /\b(angst|trauma|fear|panic|worry|sad)\b/i;
    return this.manager.get(category).filter((t) => traumaRegex.test(t));
  }

  clear(category?: MemoryCategory) {
    this.manager.clear(category as any);
  }
}
