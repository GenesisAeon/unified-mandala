import { describe, it, expect, vi } from 'vitest';
import { AeonOverlayAgent } from '../AeonOverlayAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('AeonOverlayAgent', () => {
  it('logs overlay action', async () => {
    const agent = new AeonOverlayAgent();
    await agent.handle({ id: 'ov-1', description: '...' });
    expect(console.log).toHaveBeenCalledWith('🌌 AeonOverlay → Overlay für ov-1');
  });
});
