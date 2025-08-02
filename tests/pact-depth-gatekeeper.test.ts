import { hasAccess } from '../pact-depth-rules';

describe('PactDepthGatekeeper', () => {
  it('allows admin above depth threshold', () => {
    expect(hasAccess(17, 'admin')).toBe(true);
  });

  it('denies insufficient depth', () => {
    expect(hasAccess(10, 'admin')).toBe(false);
  });

  it('denies non-admin roles', () => {
    expect(hasAccess(20, 'developer')).toBe(false);
  });
});
