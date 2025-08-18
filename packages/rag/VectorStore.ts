import fs from 'fs';
import path from 'path';

export interface VectorRecord {
  id: string;
  vector: number[];
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export class VectorStore {
  private records: VectorRecord[] = [];

  constructor(private filePath: string) {
    if (fs.existsSync(filePath)) {
      try {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.records = Array.isArray(json.records) ? json.records : [];
      } catch {
        this.records = [];
      }
    }
  }

  add(id: string, vector: number[]): void {
    this.records.push({ id, vector });
    this.save();
  }

  search(query: number[], k = 5): { id: string; score: number }[] {
    return this.records
      .map((r) => ({ id: r.id, score: cosineSimilarity(query, r.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }

  private save(): void {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(
      this.filePath,
      JSON.stringify({ records: this.records }, null, 2)
    );
  }
}

export default VectorStore;
