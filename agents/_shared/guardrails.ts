import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
type Policy = {
  defaults: {
    max_qps: number;
    max_concurrency: number;
    request_timeout_ms: number;
    retry: { attempts: number; base_delay_ms: number; jitter: boolean };
    circuit_breaker: { failure_threshold: number; cooldown_ms: number };
    allowed_domains: string[];
    user_consent_required: boolean;
  };
  agents?: Record<string, Partial<Policy['defaults']>>;
};
function loadPolicy(): Policy {
  const p = path.resolve(process.cwd(), 'governance/policies/agents-policy.yaml');
  const txt = fs.readFileSync(p, 'utf8');
  return yaml.parse(txt) as Policy;
}
export function makeGuard(agentId: string) {
  const pol = loadPolicy();
  const base = pol.defaults;
  const ov = (pol.agents && pol.agents[agentId]) || {};
  const merged = { ...base, ...ov };
  return {
    consentRequired: !!merged.user_consent_required,
    requestTimeoutMs: merged.request_timeout_ms,
    ensureAllowedDomain: (urlStr: string) => {
      const u = new URL(urlStr);
      const host = u.hostname.toLowerCase();
      const ok = merged.allowed_domains.some((d) => host === d || host.endsWith('.' + d));
      if (!ok) throw new Error(`domain_not_allowed:${host}`);
    },
    limits: {
      maxQps: merged.max_qps,
      maxConcurrency: merged.max_concurrency,
      retry: merged.retry,
      circuit: merged.circuit_breaker,
    },
  };
}
