import { describe, it, expect, vi } from 'vitest';
import { HookTriggererAgent } from '../HookTriggererAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('HookTriggererAgent', () => {
  it('logs hook trigger', async () => {
    const agent = new HookTriggererAgent();
    await agent.handle({ id: 'T-Hook', description: '...' });
    expect(console.log).toHaveBeenCalledWith('🔔 HookTriggerer → Trigger für T-Hook');
  });

  it('sends POST request when url provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as any);
    const agent = new HookTriggererAgent(fetchMock as any);
    await agent.handle({ id: 'T-URL', description: '...', url: 'https://example.com/hook' });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/hook',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
