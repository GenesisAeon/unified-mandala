export interface NarrativeStep {
  text: string;
  /**
   * Mapping of choice label to next step id.
   */
  choices: Record<string, string>;
}

/**
 * Simple branching narrative engine.
 * Steps can register choices leading to other steps.
 */
export class InteractiveNarrativeEngine {
  private steps: Record<string, NarrativeStep> = {};
  private current?: string;
  private history: string[] = [];

  addStep(id: string, text: string, choices: Record<string, string> = {}) {
    this.steps[id] = { text, choices };
  }

  start(id: string) {
    if (!this.steps[id]) {
      throw new Error(`Unknown step: ${id}`);
    }
    this.current = id;
    this.history = [id];
  }

  choose(option: string) {
    if (!this.current) {
      throw new Error('Narrative not started');
    }
    const step = this.steps[this.current];
    const next = step.choices[option];
    if (!next) {
      throw new Error(`Invalid choice: ${option}`);
    }
    this.current = next;
    this.history.push(next);
  }

  getCurrent() {
    if (!this.current) return undefined;
    const step = this.steps[this.current];
    return { id: this.current, ...step };
  }

  getHistory() {
    return [...this.history];
  }
}
