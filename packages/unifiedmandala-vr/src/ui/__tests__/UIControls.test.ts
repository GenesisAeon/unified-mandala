import { describe, it, expect } from 'vitest';
import { setupWebXR } from '../UIControls';

describe('UIControls', () => {
  it('setupWebXR exists', () => {
    expect(typeof setupWebXR).toBe('function');
  });
});
