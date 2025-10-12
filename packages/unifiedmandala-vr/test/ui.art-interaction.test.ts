import { describe, it, expect } from 'vitest';
import { ArtInteraction } from '../src/ui/ArtInteraction';

describe('VR UI - ArtInteraction', () => {
  it('instantiates and starts without errors', () => {
    const ai = new ArtInteraction();
    expect(() => ai.start()).not.toThrow();
  });
});

