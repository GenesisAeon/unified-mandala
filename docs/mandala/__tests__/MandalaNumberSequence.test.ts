import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('MandalaNumberSequence doc', () => {
  it('contains interaction section', () => {
    const content = fs.readFileSync(require.resolve('../MandalaNumberSequence.md'), 'utf8');
    expect(content).toMatch(/## Interaktion/);
  });
});
