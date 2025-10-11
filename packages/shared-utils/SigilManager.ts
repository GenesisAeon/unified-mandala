import YAML from 'yaml';
import { EventEmitter } from 'events';

export interface SigilEntry {
  id: string;
  data: any;
}

export type SigilManagerEvent =
  | { type: 'sigil:added'; entry: SigilEntry }
  | { type: 'sigil:updated'; entry: SigilEntry }
  | { type: 'sigil:removed'; id: string };

export class SigilManager extends EventEmitter {
  private sigils: SigilEntry[] = [];
  private currentId = '';

  constructor() {
    super();
  }

  list(): SigilEntry[] {
    return this.sigils;
  }

  add(entry: SigilEntry): void {
    this.sigils.push(entry);
    if (!this.currentId) this.currentId = entry.id;
    this.emit('sigil:added', entry);
  }

  update(id: string, data: any): void {
    const s = this.sigils.find((e) => e.id === id);
    if (s) {
      s.data = data;
      this.emit('sigil:updated', s);
    }
  }

  remove(id: string): void {
    this.sigils = this.sigils.filter((e) => e.id !== id);
    this.emit('sigil:removed', id);
  }

  currentSigil(): string {
    return this.currentId;
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
