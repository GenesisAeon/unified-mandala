export class TuringOrchestrator {
  run(prompt: string, response: string): boolean {
    return prompt.trim() !== response.trim();
  }
}
