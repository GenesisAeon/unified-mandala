import { describe, it, expect, vi } from 'vitest';
import { GreekMathAeonDispatcher } from './GreekMathAeonDispatcher';

describe('GreekMathAeonDispatcher', () => {
  it('emits error', () => {
    const dispatcher = new GreekMathAeonDispatcher();
    const spy = vi.fn();
    process.on('dispatcher:error', spy);
    dispatcher.dispatch(() => { throw new Error('x'); });
    expect(spy).toHaveBeenCalled();
  });
});
