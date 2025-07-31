import fs from 'fs';
import { describe, it, expect } from 'vitest';

describe('semantic-release config', () => {
  it('exists and includes github plugin', () => {
    const cfg = fs.readFileSync('.releaserc.yaml', 'utf-8');
    expect(cfg).toMatch('github');
  });
});
