test('creates oscillator with mapped frequency', () => {
  const start = jest.fn();
  const stop = jest.fn();
  const oscConnect = jest.fn();
  const gainConnect = jest.fn();
  const gainNode = { gain: { value: 0 }, connect: gainConnect } as any;
  const ctx = {
    createOscillator: () => ({
      frequency: { value: 0 },
      connect: oscConnect,
      start,
      stop,
    }) as any,
    createGain: () => gainNode,
    destination: {},
    currentTime: 0,
  } as any;
  (global as any).AudioContext = function () {
    return ctx;
  } as any;
  const { sonifyCREP } = require('../RealTimeCREPSonification');
  const osc = sonifyCREP(0.5, { duration: 1, volume: 0.3, type: 'square' });
  expect(osc.frequency.value).toBeCloseTo(330);
  expect(start).toHaveBeenCalled();
  expect(stop).toHaveBeenCalledWith(1);
  expect(gainNode.gain.value).toBeCloseTo(0.3);
  expect(osc.type).toBe('square');
  expect(oscConnect).toHaveBeenCalledWith(gainNode);
  expect(gainConnect).toHaveBeenCalledWith(ctx.destination);
});
