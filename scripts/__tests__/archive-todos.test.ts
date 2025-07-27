import { describe, it, expect } from 'vitest';
import { archiveAdvancedTodos } from '../archive-todos';

describe('archiveAdvancedTodos', () => {
  it('returns archived', () => {
    expect(archiveAdvancedTodos()).toBe('archived');
  });
});
