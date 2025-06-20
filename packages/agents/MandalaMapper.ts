export interface MandalaMapping {
  id: string;
  intensity: number;
}

export class MandalaMapper {
  private mappings: MandalaMapping[] = [];

  add(mapping: MandalaMapping): void {
    this.mappings.push(mapping);
  }

  getAll(): MandalaMapping[] {
    return this.mappings;
  }
}
