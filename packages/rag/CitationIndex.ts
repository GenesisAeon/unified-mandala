import fs from 'fs';
import path from 'path';

export interface CitationRecord {
  id: string;
  docId: string;
  chunk: number;
  text: string;
  source?: string;
}

/**
 * Stores citation metadata for indexed chunks and can render
 * markdown or HTML reference lists.
 */
export class CitationIndex {
  private citations: CitationRecord[] = [];

  constructor(private filePath: string) {
    if (fs.existsSync(filePath)) {
      try {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.citations = Array.isArray(json.citations) ? json.citations : [];
      } catch {
        this.citations = [];
      }
    }
  }

  /** Add or replace a citation record. */
  add(record: CitationRecord): void {
    const existingIdx = this.citations.findIndex((c) => c.id === record.id);
    if (existingIdx >= 0) {
      this.citations[existingIdx] = record;
    } else {
      this.citations.push(record);
    }
    this.save();
  }

  get(id: string): CitationRecord | undefined {
    const rec = this.citations.find((c) => c.id === id);
    return rec ? { ...rec } : undefined;
  }

  list(): CitationRecord[] {
    return this.citations.map((c) => ({ ...c }));
  }

  /** Render markdown list for given citation ids. */
  renderMarkdown(ids: string[]): string {
    return ids
      .map((id, idx) => {
        const c = this.get(id);
        if (!c) return '';
        const link = c.source ? ` ([source](${c.source}))` : '';
        return `[${idx + 1}] ${c.text}${link}`;
      })
      .filter(Boolean)
      .join('\n');
  }

  /** Render HTML ordered list for given citation ids. */
  renderHTML(ids: string[]): string {
    const items = ids
      .map((id) => {
        const c = this.get(id);
        if (!c) return '';
        const link = c.source ? ` (<a href="${c.source}">source</a>)` : '';
        return `<li>${escapeHtml(c.text)}${link}</li>`;
      })
      .filter(Boolean)
      .join('');
    return `<ol>${items}</ol>`;
  }

  private save(): void {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify({ citations: this.citations }, null, 2));
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default CitationIndex;
