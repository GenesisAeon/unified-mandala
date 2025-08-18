import { describe, it, expect, beforeEach } from 'vitest';
import { withPersonhood } from './withPersonhood';
import { ConsentRegistry } from '../../personhood/ConsentRegistry';
import { GPTEventHub } from '../GPTEventHub';

describe('withPersonhood', () => {
  const personId = 'alice';

  beforeEach(() => {
    ConsentRegistry.revoke(personId);
  });

  it('throws when consent is missing', () => {
    const wrapped = withPersonhood(() => 'ok', personId);
    expect(() => wrapped()).toThrow(/Consent required/);
  });

  it('runs handler and emits audit event when consent granted', () => {
    ConsentRegistry.grant(personId);
    let event: any = null;
    const handler = (e: any) => {
      event = e;
    };
    GPTEventHub.on('personhood-check', handler);
    const wrapped = withPersonhood((n: number) => n + 1, personId);
    const result = wrapped(1);
    expect(result).toBe(2);
    expect(event).toEqual({ personId, tool: 'anonymous' });
    GPTEventHub.off('personhood-check', handler);
  });
});
