import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { useEffect, useState } from 'react';

const CHRONIK_PATH = path.resolve('mandala-chronik.yaml');

export interface MemoryEntry {
  id: string;
  timestamp: string;
  description: string;
}

export class AeonMemory {
  private static entries: MemoryEntry[] = [];

  static load(): void {
    if (fs.existsSync(CHRONIK_PATH)) {
      const parsed = YAML.parse(fs.readFileSync(CHRONIK_PATH, 'utf-8'));
      this.entries = Array.isArray(parsed) ? parsed : [];
    }
  }

  static record(description: string): MemoryEntry {
    const entry: MemoryEntry = {
      id: `${Date.now()}`,
      timestamp: new Date().toISOString(),
      description,
    };
    this.entries.push(entry);
    fs.writeFileSync(CHRONIK_PATH, YAML.stringify(this.entries), 'utf-8');
    return entry;
  }

  static latest(n = 10): MemoryEntry[] {
    return [...this.entries].slice(-n).reverse();
  }
}

export function useAeonMemory() {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);

  useEffect(() => {
    AeonMemory.load();
    setEntries(AeonMemory.latest());
  }, []);

  const remember = (desc: string) => {
    const entry = AeonMemory.record(desc);
    setEntries([entry, ...entries]);
  };

  return { entries, remember };
}
