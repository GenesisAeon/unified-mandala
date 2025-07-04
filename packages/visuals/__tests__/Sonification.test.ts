import { playCREPTone } from '../Sonification';

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
