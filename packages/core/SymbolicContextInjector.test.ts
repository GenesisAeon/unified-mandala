import { SymbolicContextInjector } from './SymbolicContextInjector';

describe('SymbolicContextInjector', () => {
  it('injects single symbol into context', () => {
    const injector = new SymbolicContextInjector();
    injector.inject('alpha', 42);
    expect(injector.get('alpha')).toBe(42);
  });

  it('merges multiple entries', () => {
    const injector = new SymbolicContextInjector({ beta: 'init' });
    injector.injectAll({ gamma: true });
    expect(injector.getContext()).toEqual({ beta: 'init', gamma: true });
  });
});
