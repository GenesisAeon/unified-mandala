import { playCREPTone } from './playCREPTone';

test('plays tone at frequency', () => {
  const start = jest.fn();
  const stop = jest.fn();
  const connect = jest.fn();
  const oscillator = { frequency: { value: 0 }, connect, start, stop };
  globalThis.AudioContext = function () {
    return { createOscillator: () => oscillator, destination: {}, currentTime: 0 } as any;
  } as any;
  playCREPTone(2);
  expect(oscillator.frequency.value).toBe(880);
  expect(start).toHaveBeenCalled();
  expect(stop).toHaveBeenCalled();
});
