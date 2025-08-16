export interface PluginEntry {
  name: string;
  rating: number;
}

export class CommunityPluginMarketplace {
  private plugins: PluginEntry[] = [];

  add(name: string, rating = 0) {
    this.plugins.push({ name, rating });
  }

  rate(name: string, rating: number) {
    const plugin = this.plugins.find((p) => p.name === name);
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }
    plugin.rating = rating;
  }

  list() {
    return this.plugins.map((p) => ({ ...p }));
  }
}
