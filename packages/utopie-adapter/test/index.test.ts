import { describe, it, expect } from 'vitest';
import { saveSigil, createTasks } from '../src/index';

describe('utopie-adapter basics', () => {
  it('saveSigil returns the provided id', () => {
    expect(saveSigil('sig-123')).toBe('sig-123');
  });

  it('createTasks returns a review task for the sigil', () => {
    const tasks = createTasks('sig-xyz');
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks[0]).toContain('sig-xyz');
  });
});

