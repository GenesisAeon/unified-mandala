import { describe, expect, it } from 'vitest';
import { PolicyEnforcer } from './PolicyEnforcer';

describe('PolicyEnforcer', () => {
  const enforcer = new PolicyEnforcer();

  it('allows configured tool for agent', () => {
    expect(enforcer.isAllowed('personhood-agent', 'tools', 'consent-registry')).toBe(true);
  });

  it('blocks unconfigured model for agent', () => {
    expect(enforcer.isAllowed('personhood-agent', 'models', 'gpt-4o')).toBe(false);
  });
});
