import fs from 'fs';

export type MemoryCategory = 'daily' | 'weekly' | 'longterm';

interface Entry {
  text: string;
  timestamp: number;
}

export class MemoryManager {
  private store: Record<MemoryCategory, Entry[]> = {
    daily: [],
    weekly: [],
    longterm: []
  };

  private timers: Partial<Record<MemoryCategory, ReturnType<typeof setInterval>>> = {};
  constructor(
    private cleanupConfig: Record<MemoryCategory, number> = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      longterm: 30 * 24 * 60 * 60 * 1000
    }
  ) {
    (Object.keys(this.cleanupConfig) as MemoryCategory[]).forEach((cat) => {
      this.timers[cat] = setInterval(() => this.cleanup(cat), this.cleanupConfig[cat]);
    });
  }

  add(category: MemoryCategory, text: string) {
    this.store[category].push({ text, timestamp: Date.now() });
  }

  get(category: MemoryCategory): string[] {
    return this.store[category].map(e => e.text);
  }

  getCategories(): MemoryCategory[] {
    return Object.keys(this.store) as MemoryCategory[];
  }

  clear(category?: MemoryCategory) {
    if (category) {
      this.store[category] = [];
      return;
    }
    (Object.keys(this.store) as MemoryCategory[]).forEach(cat => {
      this.store[cat] = [];
    });
  }

  ingestFragments(files: string[]) {
    files.forEach((f) => {
      if (fs.existsSync(f)) {
        const lines = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean);
        lines.forEach((line) => this.add('daily', line));
      }
    });
  }

  private cleanup(category: MemoryCategory) {
    const cutoff = Date.now() - this.cleanupConfig[category];
    this.store[category] = this.store[category].filter((e) => e.timestamp >= cutoff);
  }

  stop() {
    Object.values(this.timers).forEach((t) => t && clearInterval(t));
  }
}
