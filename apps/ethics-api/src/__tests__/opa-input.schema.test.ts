import { describe, expect, it } from 'vitest';
import { assertEthicsInput, assertNetworkSignals } from '../schemas/opa-input.schema.js';

describe('OPA input schema guard', () => {
  it('normalizes IPs and enforces required network signals', () => {
    const payload: any = {
      intent: 'factual',
      content: 'Sample content',
      evidence: { domains_distinct: 2, strong_count: 1 },
      network: {
        resolved_ip: '2001:0db8::1',
        ttl_sec: 42,
        tls_san_ok: true,
        redirect_hops: 0,
      },
      policy: {
        min_ttl_sec: 20,
        max_redirect_hops: 3,
      },
    };

    assertEthicsInput(payload);
    expect(payload.network?.resolved_ip).toBe('2001:db8::1');

    expect(payload.policy?.min_ttl_sec).toBe(20);

    expect(() => assertNetworkSignals(payload)).not.toThrow();
  });
});
