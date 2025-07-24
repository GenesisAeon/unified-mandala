import { describe, it, expect } from 'vitest';
import { ArtInteraction } from '../ArtInteraction';

describe('ArtInteraction', () => {
  it('creates instance', () => {
    const art = new ArtInteraction();
    expect(art).toBeInstanceOf(ArtInteraction);
  });
});
