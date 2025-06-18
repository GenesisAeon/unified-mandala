import { CodexResonanzFraktal } from './CodexResonanzFraktal';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

describe('CodexResonanzFraktal', () => {
  beforeEach(() => {
    jest.spyOn(GPTEventHub, 'emit');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('fractalizes input and emits event', () => {
    const fraktal = new CodexResonanzFraktal();
    const result = fraktal.fractalize('alpha');
    expect(result).toBe('fractal:alpha');
    expect(fraktal.history()).toEqual(['fractal:alpha']);
    expect((GPTEventHub.emit as jest.Mock).mock.calls[0]).toEqual([
      'codex:fraktal',
      'fractal:alpha'
    ]);
  });
});
