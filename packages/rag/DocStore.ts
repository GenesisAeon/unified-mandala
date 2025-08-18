import fs from 'fs';
import path from 'path';

export interface DocRecord {
  id: string;
  text: string;
  source?: string;
  tombstoned?: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Simple document store with provenance tracking and tombstoning.
 * Persists records as JSON on disk.
 */
export class DocStore {
  private docs: DocRecord[] = [];

  constructor(private filePath: string) {
    if (fs.existsSync(filePath)) {
      try {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.docs = Array.isArray(json.docs) ? json.docs : [];
      } catch {
        this.docs = [];
      }
    }
  }

  add(record: Omit<DocRecord, 'createdAt' | 'updatedAt' | 'tombstoned'>): void {
    const now = Date.now();
    this.docs.push({ ...record, createdAt: now, updatedAt: now });
    this.save();
  }

  get(id: string): DocRecord | undefined {
    const rec = this.docs.find((d) => d.id === id && !d.tombstoned);
    return rec ? { ...rec } : undefined;
  }

  list(): DocRecord[] {
    return this.docs.filter((d) => !d.tombstoned).map((d) => ({ ...d }));
  }

  tombstone(id: string): void {
    const rec = this.docs.find((d) => d.id === id);
    if (rec) {
      rec.tombstoned = true;
      rec.updatedAt = Date.now();
      this.save();
    }
  }

  private save(): void {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify({ docs: this.docs }, null, 2));
  }
}

export default DocStore;
