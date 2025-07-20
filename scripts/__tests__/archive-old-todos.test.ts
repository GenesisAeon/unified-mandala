import { describe, it, expect } from 'vitest';
import { archiveTodos } from '../archive-old-todos';

describe('archiveTodos', () => {
  it('returns archived', () => {
    expect(archiveTodos()).toBe('archived');
  });
});
