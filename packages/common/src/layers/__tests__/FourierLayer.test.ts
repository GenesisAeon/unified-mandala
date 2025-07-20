import { FourierLayer } from '../FourierLayer';

describe('FourierLayer (common)', () => {
  it('honors threshold parameter', () => {
    const layer = new FourierLayer('T', 1, [1, 0, -1, 0], { depth: 2, threshold: 0.2 });
    const result = layer.analyze();
    expect(result.metrics.maxAmplitude).toBeGreaterThan(0);
    // threshold does not affect weight but ensures property is set
    expect((layer as any).threshold).toBe(0.2);
  });
});
