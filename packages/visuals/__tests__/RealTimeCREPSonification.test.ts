test('creates oscillator with mapped frequency', () => {
  const start = jest.fn();
  const stop = jest.fn();
  const connect = jest.fn();
  const ctx = {
    createOscillator: () => ({
      frequency: { value: 0 },
      connect,
      start,
      stop,
    }),
    destination: {},
    currentTime: 0,
  } as any;
  (global as any).AudioContext = function () {
    return ctx;
  } as any;
  const { sonifyCREP } = require('../RealTimeCREPSonification');
  const osc = sonifyCREP(0.5, { duration: 1 });
  expect(osc.frequency.value).toBeCloseTo(330);
  expect(start).toHaveBeenCalled();
  expect(stop).toHaveBeenCalledWith(1);
});
