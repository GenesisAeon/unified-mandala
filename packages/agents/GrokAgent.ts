export class GrokAgent {
  private patterns: string[] = [];

  addPattern(p: string) {
    this.patterns.push(p);
  }

  analyze(text: string): string {
    const words = text.split(/\s+/).filter(Boolean);
    const count = words.length;
    const matches = this.patterns.filter((p) => text.includes(p)).length;
    return `Grokking ${count} words with ${matches} patterns`;
  }
}
