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

  clear(category?: MemoryCategory): number {
    if (category) {
      const count = this.manager.get(category).length;
      this.manager.clear(category);
      return count;
    }
    let count = 0;
    this.listCategories().forEach((cat) => {
      count += this.manager.get(cat).length;
    });
    this.manager.clear();
    return count;
  }

  listCategories(): MemoryCategory[] {
    return this.manager.getCategories();
  }
}
