import { Agent, Task } from '../core/interfaces';

const defaultMap: Record<string, string> = {
  utilize: 'use',
  commence: 'start',
  terminate: 'end',
};

/**
 * TextSimplifier replaces complex words in a task description with
 * simpler synonyms to support easier reading.
 */
export class TextSimplifier implements Agent {
  id = 'TextSimplifier';
  layer = 'Utility';
  private simplified = '';

  constructor(private replacements: Record<string, string> = defaultMap) {}

  handle(task: Task): void {
    let text = task.description;
    for (const [complex, simple] of Object.entries(this.replacements)) {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      text = text.replace(regex, simple);
    }
    this.simplified = text;
  }

  getSimplified(): string {
    return this.simplified;
  }
}

export default TextSimplifier;
