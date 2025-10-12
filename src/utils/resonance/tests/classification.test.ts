import { describe, it, expect } from 'vitest';
import { classifyEmergence } from '../classification';

describe('resonance/classification', () => {
  it('maps high/medium/low thresholds', () => {
    expect(classifyEmergence(0.8)).toBe('high');
    expect(classifyEmergence(0.5)).toBe('medium');
    expect(classifyEmergence(0.1)).toBe('low');
  });
});
