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

  private timer: ReturnType<typeof setInterval>;

  constructor(private cleanupMs = 24 * 60 * 60 * 1000) {
    this.timer = setInterval(() => this.cleanup(), this.cleanupMs);
  }

  add(category: MemoryCategory, text: string) {
    this.store[category].push({ text, timestamp: Date.now() });
  }

  get(category: MemoryCategory): string[] {
    return this.store[category].map(e => e.text);
  }

  private cleanup() {
    const cutoff = Date.now() - this.cleanupMs;
    this.store.daily = this.store.daily.filter(e => e.timestamp >= cutoff);
  }
}
