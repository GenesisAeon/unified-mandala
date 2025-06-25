import { globalLogger } from './GlobalLogger';

describe('globalLogger', () => {
  beforeEach(() => {
    // clear existing listeners
    (globalLogger as any).listeners = [];
  });

  it('logs to console and notifies listeners', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const listener = jest.fn();
    globalLogger.subscribe(listener);

    globalLogger.log('hello');

    expect(spy).toHaveBeenCalledWith('hello');
    expect(listener).toHaveBeenCalledWith('hello');
    spy.mockRestore();
  });
});
