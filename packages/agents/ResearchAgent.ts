export class ResearchAgent {
  async fetch(query: string): Promise<string> {
    return Promise.resolve(`Ergebnis fuer ${query}`);
  }
}
