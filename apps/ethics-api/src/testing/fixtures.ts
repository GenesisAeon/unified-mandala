import type {
  EthicsOPAInput,
  EthicsOPAEvidence,
  EthicsOPANetworkSignals,
  EthicsOPAPolicyConfig,
} from '../schemas/opa-input.schema';

export function makeNetworkSignals(
  override?: Partial<EthicsOPANetworkSignals>,
): EthicsOPANetworkSignals {
  return {
    ttl_sec: 300,
    tls_san_ok: true,
    redirect_hops: 0,
    resolved_ip: '93.184.216.34',
    ...override,
  };
}

export function makeEvidence(override?: Partial<EthicsOPAEvidence>): EthicsOPAEvidence {
  return {
    domains_distinct: 2,
    strong_count: 1,
    ...override,
  };
}

export function makePolicy(override?: Partial<EthicsOPAPolicyConfig>): EthicsOPAPolicyConfig {
  return {
    min_ttl_sec: 20,
    max_redirect_hops: 3,
    ...override,
  };
}

export function makeOPAInput(override?: Partial<EthicsOPAInput>): EthicsOPAInput {
  const { network, evidence, boundary, policy, ...rest } = override ?? {};

  return {
    content: 'example prompt',
    degraded: false,
    network: { ...makeNetworkSignals(), ...(network ?? {}) },
    evidence: { ...makeEvidence(), ...(evidence ?? {}) },
    boundary: { severity_max: 'low', ...(boundary ?? {}) },
    policy: { ...makePolicy(), ...(policy ?? {}) },
    ...rest,
  };
}
