export class PantheonSymbolzeitNavigator {
  private currentIndex = 0;
  constructor(private entries: string[]) {}
  next(): string {
    this.currentIndex = (this.currentIndex + 1) % this.entries.length;
    return this.entries[this.currentIndex];
  }
}
