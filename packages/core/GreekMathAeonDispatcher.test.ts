import { describe, it, expect, vi } from 'vitest';
import { GreekMathAeonDispatcher } from './GreekMathAeonDispatcher';

describe('GreekMathAeonDispatcher', () => {
  it('emits error', () => {
    const dispatcher = new GreekMathAeonDispatcher();
    const spy = vi.fn();
    dispatcher.emitter.on('dispatcher:error', spy);
    dispatcher.dispatch(() => { throw new Error('x'); });
    expect(spy).toHaveBeenCalled();
  });

  it('returns result and emits on failure', () => {
    const dispatcher = new GreekMathAeonDispatcher();
    const spy = vi.fn();
    dispatcher.emitter.on('dispatcher:error', spy);
    const ok = dispatcher.dispatchWithResult(() => 42);
    expect(ok).toBe(42);
    const fail = dispatcher.dispatchWithResult(() => { throw new Error('x'); });
    expect(fail).toBeNull();
    expect(spy).toHaveBeenCalled();
  });
});
