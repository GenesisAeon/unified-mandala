import { describe, it, expect, vi } from 'vitest';
import { DreamSyncAgent } from '../DreamSyncAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('DreamSyncAgent', () => {
  it('logs dream sync', async () => {
    const agent = new DreamSyncAgent();
    await agent.handle({ id: 'T-Dream', description: '...' });
    expect(console.log).toHaveBeenCalledWith('🌙 DreamSync → Sync für T-Dream');
  });
});
