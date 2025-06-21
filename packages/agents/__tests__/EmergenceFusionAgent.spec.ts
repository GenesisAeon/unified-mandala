import { describe, it, expect, vi } from 'vitest';
import { EmergenceFusionAgent } from '../EmergenceFusionAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('EmergenceFusionAgent', () => {
  it('logs fusion action', async () => {
    const agent = new EmergenceFusionAgent();
    await agent.handle({ id: 'T-Fuse', description: '...' });
    expect(console.log).toHaveBeenCalledWith('⚡ EmergenceFusion → Fusion für T-Fuse');
  });
});
