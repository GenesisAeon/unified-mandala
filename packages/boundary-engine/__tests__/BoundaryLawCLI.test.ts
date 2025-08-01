import { describe, it, expect } from 'vitest';
import { runBoundaryLawCLI } from '../BoundaryLawCLI';

describe('BoundaryLawCLI', () => {
  it('runs scan command', () => {
    expect(() => runBoundaryLawCLI(['--scan'])).not.toThrow();
  });
});
