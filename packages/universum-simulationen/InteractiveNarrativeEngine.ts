export class InteractiveNarrativeEngine {
  private steps: string[] = [];
  addStep(step: string) {
    this.steps.push(step);
  }
  getHistory() {
    return [...this.steps];
  }
}
