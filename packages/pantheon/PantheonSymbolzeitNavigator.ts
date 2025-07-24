export class PantheonSymbolzeitNavigator {
  private currentIndex = 0;

  constructor(private entries: string[]) {}

  /**
   * Get the next module in a simple cycle.
   */
  next(): string {
    this.currentIndex = (this.currentIndex + 1) % this.entries.length;
    return this.entries[this.currentIndex];
  }

  /**
   * Retrieve a module based on the provided Symbolzeit value.
   * The Symbolzeit number is mapped cyclically to the module list.
   */
  forSymbolzeit(symbolzeit: number): string {
    const index = Math.floor(symbolzeit) % this.entries.length;
    this.currentIndex = index;
    return this.entries[index];
  }
}
