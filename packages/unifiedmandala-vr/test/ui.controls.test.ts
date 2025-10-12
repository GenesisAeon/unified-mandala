import { describe, it, expect } from 'vitest';
import { setupWebXR } from '../src/ui/UIControls';

describe('VR UI - UIControls', () => {
  it('setupWebXR is callable', () => {
    expect(() => setupWebXR()).not.toThrow();
  });
});

