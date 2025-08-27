import { DesktopAutomationAgent, AutomationStep } from './DesktopAutomationAgent';

/**
 * UIMacroSynthAgent turns simple natural language prompts into
 * desktop automation steps and executes them via DesktopAutomationAgent.
 */
export class UIMacroSynthAgent {
  constructor(private automation = new DesktopAutomationAgent()) {}

  /**
   * Parse a natural language prompt into automation steps.
   * Supported commands:
   *  - "open <app>"
   *  - "copy <text>" or "set clipboard <text>"
   *  - "read clipboard" or "get clipboard"
   */
  parse(prompt: string): AutomationStep[] {
    const steps: AutomationStep[] = [];
    const commands = prompt
      .split(/[\n;,]+/)
      .map((c) => c.trim())
      .filter(Boolean);

    for (const cmd of commands) {
      if (/^open\s+/i.test(cmd)) {
        const app = cmd.replace(/^open\s+/i, '').trim();
        steps.push({ type: 'open-app', value: app });
      } else if (/^(set clipboard|copy)\s+/i.test(cmd)) {
        const text = cmd.replace(/^(set clipboard|copy)\s+/i, '').trim();
        steps.push({ type: 'set-clipboard', value: text });
      } else if (/^(read|get) clipboard$/i.test(cmd)) {
        steps.push({ type: 'get-clipboard' });
      }
    }

    return steps;
  }

  /** Execute the prompt by parsing and running the resulting steps. */
  async run(prompt: string) {
    const steps = this.parse(prompt);
    return this.automation.runSteps(steps);
  }
}

export default UIMacroSynthAgent;
