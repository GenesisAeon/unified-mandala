export interface Attribution {
  artifact: string;
  actor: string;
  share: number;
  license?: string;
}

/**
 * AttributionIndex maps artifacts to contributor shares and licenses.
 */
export class AttributionIndex {
  private readonly index: Record<string, Attribution[]> = {};

  add(entry: Attribution): void {
    const list = this.index[entry.artifact] ?? (this.index[entry.artifact] = []);
    list.push(entry);
  }

  get(artifact: string): Attribution[] {
    return this.index[artifact] ?? [];
  }
}
