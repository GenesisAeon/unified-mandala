const { FourierLayerBridge } = require('./FourierLayerBridge');

describe('FourierLayerBridge', () => {
  it('returns data unchanged', () => {
    const bridge = new FourierLayerBridge();
    const result = bridge.connect([1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });
});
