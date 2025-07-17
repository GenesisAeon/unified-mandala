import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';

describe('VRBegegnungsraumProjektplan', () => {
  it('describes VR plan', () => {
    const content = readFileSync('docs/vr/VRBegegnungsraumProjektplan.md', 'utf-8');
    expect(content).toMatch(/VR-Begegnungsraum Projektplan/);
  });
});
