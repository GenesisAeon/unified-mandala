export class DebounceManager {
  private last: number = 0;
  constructor(private waitMs = 300) {}
  canFire(): boolean {
    const now = Date.now();
    if (now - this.last < this.waitMs) return false;
    this.last = now;
    return true;
  }
}
