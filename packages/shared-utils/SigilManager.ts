import YAML from 'yaml';

export interface SigilEntry {
  id: string;
  data: any;
}

export class SigilManager {
  private sigils: SigilEntry[] = [];

  list(): SigilEntry[] {
    return this.sigils;
  }

  add(entry: SigilEntry): void {
    this.sigils.push(entry);
  }

  update(id: string, data: any): void {
    const s = this.sigils.find(e => e.id === id);
    if (s) s.data = data;
  }

  remove(id: string): void {
    this.sigils = this.sigils.filter(e => e.id !== id);
  }

  loadFromString(id: string, text: string): SigilEntry {
    let parsed: any;
    try {
      parsed = YAML.parse(text);
    } catch {
      parsed = JSON.parse(text);
    }
    const entry = { id, data: parsed };
    this.add(entry);
    return entry;
  }
}
