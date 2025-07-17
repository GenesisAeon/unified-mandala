import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';

describe('PantheonOnboardingBlueprint', () => {
  it('contains onboarding heading', () => {
    const content = readFileSync('docs/pantheon/PantheonOnboardingBlueprint.md', 'utf-8');
    expect(content).toMatch(/Pantheon Onboarding Blueprint/);
  });
});
