import { describe, expect, it } from 'vitest';
import { DocumentGenerator } from '../DocumentGenerator';

describe('DocumentGenerator', () => {
  it('creates markdown document with title', () => {
    const generator = new DocumentGenerator();
    const result = generator.generate('Test', 'Body');
    expect(result.startsWith('# Test')).toBe(true);
    expect(result.includes('Body')).toBe(true);
  });
});
