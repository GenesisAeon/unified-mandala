export class GrokAgent {
  analyze(text: string): string {
    const words = text.split(/\s+/).filter(Boolean);
    const count = words.length;
    return `Grokking ${count} words`;
  }
}
