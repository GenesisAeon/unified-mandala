import { openApp, setClipboard, getClipboard } from '../os-bridge/WindowsPS';

export interface AutomationStep {
  type: 'open-app' | 'set-clipboard' | 'get-clipboard';
  value?: string;
}

interface Bridge {
  openApp: (path: string) => Promise<void>;
  setClipboard: (text: string) => Promise<void>;
  getClipboard: () => Promise<string>;
}

/**
 * DesktopAutomationAgent executes simple Windows automation workflows
 * through the OS bridge. Steps are executed sequentially.
 */
export class DesktopAutomationAgent {
  constructor(private bridge: Bridge = { openApp, setClipboard, getClipboard }) {}

  async runSteps(steps: AutomationStep[]): Promise<(string | null)[]> {
    const results: (string | null)[] = [];
    for (const step of steps) {
      switch (step.type) {
        case 'open-app':
          if (!step.value) throw new Error('Missing value for open-app');
          await this.bridge.openApp(step.value);
          results.push(null);
          break;
        case 'set-clipboard':
          if (!step.value) throw new Error('Missing value for set-clipboard');
          await this.bridge.setClipboard(step.value);
          results.push(null);
          break;
        case 'get-clipboard':
          results.push(await this.bridge.getClipboard());
          break;
        default:
          throw new Error(`Unsupported step: ${step.type}`);
      }
    }
    return results;
  }
}
