export class AeonKIResonanzAnalyzer {
  analyze(logs: string[]): { resonanceCount: number } {
    const resonanceCount = logs.filter((msg) => /resonanz/i.test(msg)).length;
    return { resonanceCount };
  }
}
