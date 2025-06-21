import { describe, it, expect, vi } from 'vitest';
import { ResonancePlotterAgent } from '../ResonancePlotterAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('ResonancePlotterAgent', () => {
  it('plots resonance', async () => {
    const agent = new ResonancePlotterAgent();
    await agent.handle({ id: 'plot-1', description: '...' });
    expect(console.log).toHaveBeenCalledWith('📈 ResonancePlotter → Plot für plot-1');
  });
});
