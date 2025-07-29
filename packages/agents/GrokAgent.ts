export class GrokAgent {
  private patterns: string[] = [];

  setPatternLibrary(patterns: string[]) {
    this.patterns = patterns;
  }

  analyze(text: string): string {
    const words = text.split(/\s+/).filter(Boolean);
    const matches = words.filter(w => this.patterns.includes(w));
    const count = words.length;
    if (matches.length) {
      return `Matched ${matches.length}: ${matches.join(', ')}`;
    }
    return `Grokking ${count} words`;
  }
}
