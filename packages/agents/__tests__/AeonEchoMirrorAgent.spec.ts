import { describe, it, expect, vi } from 'vitest';
import { AeonEchoMirrorAgent } from '../AeonEchoMirrorAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('AeonEchoMirrorAgent', () => {
  it('mirrors aeon', async () => {
    const agent = new AeonEchoMirrorAgent();
    await agent.handle({ id: 'echo-1', description: '...' });
    expect(console.log).toHaveBeenCalledWith('🪞 AeonEchoMirror → Spiegelung für echo-1');
  });
});
