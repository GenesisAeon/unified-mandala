import { describe, it, expect, vi } from 'vitest';
import { MandalaCollectiveActivator } from './MandalaCollectiveActivator';

describe('MandalaCollectiveActivator', () => {
  it('publishes start event', () => {
    const bus = { publish: vi.fn() };
    const act = new MandalaCollectiveActivator();
    expect(act.activate(bus)).toBe('activated');
    expect(bus.publish).toHaveBeenCalledWith(
      'mandala.collective.started',
      expect.objectContaining({ timestamp: expect.any(Number) }),
    );
  });
});
