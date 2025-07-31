import { MemoryManager, MemoryCategory } from '../memory-manager';

export class MemoryGovernanceService {
  constructor(private manager = new MemoryManager()) {}

  enforceLimit(category: MemoryCategory, maxEntries: number) {
    const entries = this.manager.get(category);
    if (entries.length > maxEntries) {
      const trimmed = entries.slice(-maxEntries);
      this.manager.clear(category as any);
      trimmed.forEach((e) => this.manager.add(category, e));
    }
  }

  detectTrauma(category: MemoryCategory): string[] {
    const traumaRegex = /\b(angst|trauma|fear|panic|worry|sad)\b/i;
    return this.manager.get(category).filter((t) => traumaRegex.test(t));
  }

  clear(category?: MemoryCategory) {
    this.manager.clear(category as any);
  }

  listCategories(): MemoryCategory[] {
    return this.manager.getCategories();
  }
}
