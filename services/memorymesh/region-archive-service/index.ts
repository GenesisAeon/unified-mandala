export class RegionArchive {
  private store: Record<string, string[]> = {};

  log(region: string, message: string) {
    if (!this.store[region]) this.store[region] = [];
    this.store[region].push(message);
  }

  list(region: string): string[] {
    return this.store[region] || [];
  }
}
