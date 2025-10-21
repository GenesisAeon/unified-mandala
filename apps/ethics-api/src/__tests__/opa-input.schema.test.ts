import { describe, expect, it } from 'vitest';
import { assertEthicsInput, assertNetworkSignals } from '../schemas/opa-input.schema.js';

describe('OPA input schema guard', () => {
  it('normalizes IPs and enforces required network signals', () => {
    const payload: any = {
      intent: 'factual',
      content: 'Sample content',
      evidence: { domains_distinct: 2, strong: 1 },
      network: {
        resolved_ip: '2001:0db8::1',
        ttl_sec: 42,
        tls_san_ok: true,
        redirect_hops: 0,
      },
    };

    assertEthicsInput(payload);
    expect(payload.network?.resolved_ip).toBe('2001:db8::1');

    expect(() => assertNetworkSignals(payload)).not.toThrow();
  });
});
