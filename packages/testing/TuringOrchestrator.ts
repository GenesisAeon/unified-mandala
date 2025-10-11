export class TuringOrchestrator {
  run(prompt: string, response: string): boolean {
    return prompt.trim() !== response.trim();
  }

  runBatch(pairs: Array<{ prompt: string; response: string }>): number {
    let passed = 0;
    for (const { prompt, response } of pairs) {
      if (this.run(prompt, response)) {
        passed += 1;
      }
    }
    return passed / pairs.length;
  }
}
