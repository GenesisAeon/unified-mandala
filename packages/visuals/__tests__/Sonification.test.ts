import { playCREPTone, fallbackTone } from '../Sonification';

test('plays tone without throwing', () => {
  globalThis.AudioContext = function () {
    return {
      createOscillator: () => ({ connect: jest.fn(), start: jest.fn(), stop: jest.fn(), frequency: { value: 0 } }),
      destination: {},
      currentTime: 0
    } as any;
  } as any;
  playCREPTone(1);
});

test('uses fallback when AudioContext fails', () => {
  const orig = globalThis.AudioContext;
  globalThis.AudioContext = function () {
    throw new Error('fail');
  } as any;
  const spy = vi.fn();
  global.console = { ...console, warn: spy, log: spy } as any;
  playCREPTone(0.5);
  expect(spy).toHaveBeenCalled();
  globalThis.AudioContext = orig;
});
