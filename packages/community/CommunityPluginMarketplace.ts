export class CommunityPluginMarketplace {
  private plugins: string[] = [];
  add(name: string) { this.plugins.push(name); }
  list() { return [...this.plugins]; }
}
