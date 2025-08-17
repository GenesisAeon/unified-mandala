import { ConsentRegistry } from '../packages/personhood/ConsentRegistry';
import { requireConsent } from '../packages/personhood/PolicyGuard';

describe('Personhood Policy Guard', () => {
  test('throws when consent missing', () => {
    expect(() => requireConsent('user1')).toThrow('Consent required');
  });

  test('allows when consent granted', () => {
    ConsentRegistry.grant('user2');
    expect(() => requireConsent('user2')).not.toThrow();
  });
});
