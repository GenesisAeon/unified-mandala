export class GrokAgent {
  analyze(text: string): number {
    // naive pattern count
    return (text.match(/\b[a-zA-Z]{4}\b/g) || []).length;
  }
}
