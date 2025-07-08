import { FourierLayer, FourierLayerEvents } from './FourierLayer';

describe('FourierLayer', () => {
  it('computes amplitude metrics', () => {
    const layer = new FourierLayer('L1', 1, [1, 0, -1, 0], { depth: 1 });
    const metrics = layer.analyze();
    expect(metrics.maxAmplitude).toBeGreaterThan(0);
    expect(metrics.avgAmplitude).toBeGreaterThan(0);
  });

  it('emits metrics event', () => {
    const events: any[] = [];
    FourierLayerEvents.on('metrics', e => events.push(e));
    const layer = new FourierLayer('L2', 1, [0, 1, 0, -1], { depth: 1 });
    layer.analyze();
    expect(events.length).toBe(1);
    expect(events[0].id).toBe('L2');
  });
});
