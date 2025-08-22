import { ConsentRegistry } from '../packages/personhood/ConsentRegistry';
import { requireConsent, enforcePolicy } from '../packages/personhood/PolicyGuard';
import { join } from 'path';
import os from 'os';
import { existsSync, unlinkSync } from 'fs';

describe('Personhood Policy Guard', () => {
  beforeAll(() => {
    const logPath = join(os.tmpdir(), 'personhood_audit.log');
    process.env.PERSONHOOD_AUDIT_LOG = logPath;
    if (existsSync(logPath)) unlinkSync(logPath);
  });

  test('throws when consent missing', () => {
    expect(() => requireConsent('user1')).toThrow('Consent required');
  });

  test('allows when consent granted', () => {
    ConsentRegistry.grant('user2');
    expect(() => requireConsent('user2')).not.toThrow();
  });

  test('enforces region and model and review rules', () => {
    ConsentRegistry.grant('user3');
    expect(() => enforcePolicy({ personId: 'user3', region: 'xx', model: 'gpt-4o', reviewed: true })).toThrow('Region not allowed');
    expect(() => enforcePolicy({ personId: 'user3', region: 'eu', model: 'bad-model', reviewed: true })).toThrow('Model not allowed');
    expect(() => enforcePolicy({ personId: 'user3', region: 'eu', model: 'gpt-4o', reviewed: false })).toThrow('Review required');
    expect(() => enforcePolicy({ personId: 'user3', region: 'eu', model: 'gpt-4o', reviewed: true })).not.toThrow();
  });
});
