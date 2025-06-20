export class DreamFieldBinder {
  private bound: string[] = [];

  bind(id: string): void {
    this.bound.push(id);
  }

  get boundIds(): string[] {
    return this.bound;
  }
}
