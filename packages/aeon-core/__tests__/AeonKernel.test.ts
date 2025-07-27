import { describe, it, expect } from 'vitest';
import { AeonKernel } from '../AeonKernel';

describe('AeonKernel', () => {
  it('updates state and notifies listeners', () => {
    const kernel = new AeonKernel();
    let called = false;
    kernel.onChange(() => { called = true; });
    kernel.setState({ coherence: 1 });
    expect(kernel.getState().coherence).toBe(1);
    expect(called).toBe(true);
  });
});
