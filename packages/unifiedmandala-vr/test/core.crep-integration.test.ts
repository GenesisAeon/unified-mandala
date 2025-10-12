import { describe, it, expect, vi } from 'vitest';
import { CREPIntegration } from '../src/core/CREPIntegration';

describe('VR Core - CREPIntegration', () => {
  it('emits score to all subscribers', () => {
    const bus = new CREPIntegration();
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    bus.onUpdate(cb1);
    bus.onUpdate(cb2);
    bus.emit(0.77);
    expect(cb1).toHaveBeenCalledWith(0.77);
    expect(cb2).toHaveBeenCalledWith(0.77);
  });
});

