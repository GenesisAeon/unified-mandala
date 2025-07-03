import { usePyramidAudio } from './usePyramidAudio';

test('runs without crashing', () => {
  globalThis.AudioContext = function () {
    return { createOscillator: () => ({ connect: jest.fn(), start: jest.fn(), stop: jest.fn(), frequency: { value: 0 } }), createGain: () => ({ connect: jest.fn() }), destination: {}, currentTime: 0 } as any;
  } as any;
  usePyramidAudio([1, 2]);
});
