import fs from 'fs';
import path from 'path';

export interface Annotation {
  id: string;
  text: string;
  createdAt: number;
}

/**
 * AnnotationsStore persists simple text annotations per document ID.
 * Each document is stored as a JSON array on disk to keep the
 * implementation lightweight yet durable.
 */
export class AnnotationsStore {
  constructor(private baseDir: string) {}

  private filePath(docId: string) {
    return path.join(this.baseDir, `${docId}.json`);
  }

  private load(docId: string): Annotation[] {
    const file = this.filePath(docId);
    if (!fs.existsSync(file)) return [];
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8')) as Annotation[];
    } catch {
      return [];
    }
  }

  private save(docId: string, list: Annotation[]) {
    fs.mkdirSync(this.baseDir, { recursive: true });
    fs.writeFileSync(this.filePath(docId), JSON.stringify(list, null, 2));
  }

  add(docId: string, text: string): Annotation {
    const list = this.load(docId);
    const ann: Annotation = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      createdAt: Date.now(),
    };
    list.push(ann);
    this.save(docId, list);
    return ann;
  }

  list(docId: string): Annotation[] {
    return this.load(docId);
  }
}
