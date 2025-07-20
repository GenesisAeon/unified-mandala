import { describe, it, expect } from 'vitest';
import { generateDocs } from '../doc-comments-generator';

describe('generateDocs', () => {
  it('returns generated string', () => {
    expect(generateDocs()).toBe('docs generated');
  });
});
