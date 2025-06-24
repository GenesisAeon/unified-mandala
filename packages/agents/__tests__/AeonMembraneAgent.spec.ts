import { describe, it, expect, vi } from 'vitest';
import { AeonMembraneAgent } from '../AeonMembraneAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('AeonMembraneAgent', () => {
  it('harmonizes task input', async () => {
    const agent = new AeonMembraneAgent(0);
    await agent.handle({ id: 'm-1', description: 'test 10 20' });
    expect((console.log as any).mock.calls[0][0]).toContain('AeonMembraneAgent');
  });
});
