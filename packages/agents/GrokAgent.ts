export class GrokAgent {
  private patterns: string[] = [];

  setPatternLibrary(patterns: string[]) {
    this.patterns = patterns;
  }

  /**
   * Learns patterns from provided text by extracting unique words
   * and merging them into the internal pattern library.
   */
  learn(text: string) {
    const words = text.split(/\s+/).filter(Boolean);
    const unique = Array.from(new Set(words));
    this.patterns = Array.from(new Set([...this.patterns, ...unique]));
  }

  analyze(text: string): string {
    const words = text.split(/\s+/).filter(Boolean);
    const matches = words.filter((w) => this.patterns.includes(w));
    const count = words.length;
    if (matches.length) {
      return `Matched ${matches.length}: ${matches.join(', ')}`;
    }
    return `Grokking ${count} words`;
  }
}
