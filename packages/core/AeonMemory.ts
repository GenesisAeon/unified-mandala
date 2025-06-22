import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { useEffect, useState } from 'react';
import { Task } from './interfaces';

const CHRONIK_PATH = path.resolve('mandala-chronik.yaml');

export interface MemoryEntry {
  id: string;
  timestamp: string;
  description: string;
  task?: Task;
  crepScore?: number;
}

export class AeonMemory {
  private static entries: MemoryEntry[] = [];

  static load(): void {
    if (fs.existsSync(CHRONIK_PATH)) {
      const parsed = YAML.parse(fs.readFileSync(CHRONIK_PATH, 'utf-8'));
      this.entries = Array.isArray(parsed) ? parsed : [];
    }
  }

  static record(description: string, extra: Partial<MemoryEntry> = {}): MemoryEntry {
    const entry: MemoryEntry = {
      id: `${Date.now()}`,
      timestamp: new Date().toISOString(),
      description,
      ...extra
    };
    this.entries.push(entry);
    fs.writeFileSync(CHRONIK_PATH, YAML.stringify(this.entries), 'utf-8');
    return entry;
  }

  static latest(n = 10): MemoryEntry[] {
    return [...this.entries].slice(-n).reverse();
  }

  static top(n = 5): MemoryEntry[] {
    return [...this.entries]
      .sort((a, b) => (b.crepScore || 0) - (a.crepScore || 0))
      .slice(0, n);
  }

  static all(): MemoryEntry[] {
    return [...this.entries];
  }
}

export function useAeonMemory() {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);

  useEffect(() => {
    AeonMemory.load();
    setEntries(AeonMemory.latest());
  }, []);

  const remember = (desc: string, extra?: Partial<MemoryEntry>) => {
    const entry = AeonMemory.record(desc, extra);
    setEntries([entry, ...entries]);
  };

  return { entries, remember };
}
