import { describe, it, expect, vi } from 'vitest';
import { SigilNetworkerAgent } from '../SigilNetworkerAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('SigilNetworkerAgent', () => {
  it('connects sigil network', async () => {
    const agent = new SigilNetworkerAgent();
    await agent.handle({ id: 'sigil-1', description: '...' });
    expect(console.log).toHaveBeenCalledWith('🌐 SigilNetworker → Netzwerk für sigil-1');
  });
});
