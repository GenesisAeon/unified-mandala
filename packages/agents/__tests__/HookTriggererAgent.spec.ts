import { describe, it, expect, vi } from 'vitest';
import { HookTriggererAgent } from '../HookTriggererAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('HookTriggererAgent', () => {
  it('logs hook trigger', async () => {
    const agent = new HookTriggererAgent();
    await agent.handle({ id: 'T-Hook', description: '...' });
    expect(console.log).toHaveBeenCalledWith('🔔 HookTriggerer → Trigger für T-Hook');
  });
});
