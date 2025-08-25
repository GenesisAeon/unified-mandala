import { describe, it, expect } from 'vitest';
import { DesktopAutomationAgent, AutomationStep } from './DesktopAutomationAgent';

describe('DesktopAutomationAgent', () => {
  it('executes automation steps via provided bridge', async () => {
    const calls: string[] = [];
    const mockBridge = {
      openApp: async (p: string) => { calls.push(`open:${p}`); },
      setClipboard: async (t: string) => { calls.push(`set:${t}`); },
      getClipboard: async () => { calls.push('get'); return 'clip'; },
    };
    const agent = new DesktopAutomationAgent(mockBridge);
    const steps: AutomationStep[] = [
      { type: 'open-app', value: 'calc.exe' },
      { type: 'set-clipboard', value: 'hello' },
      { type: 'get-clipboard' }
    ];
    const result = await agent.runSteps(steps);
    expect(result).toEqual([null, null, 'clip']);
    expect(calls).toEqual(['open:calc.exe', 'set:hello', 'get']);
  });
});
