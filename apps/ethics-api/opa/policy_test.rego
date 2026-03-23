package mandala.ethics_test

import data.mandala.ethics

base_ok := {
  "content": "example",
  "degraded": false,
  "network": {
    "ttl_sec": 60,
    "tls_san_ok": true,
    "resolved_ip": "93.184.216.34",
    "redirect_hops": 0,
  },
  "evidence": {
    "domains_distinct": 2,
    "strong_count": 1,
  },
  "boundary": {
    "severity_max": "low",
  },
  "policy": {
    "min_ttl_sec": 20,
    "max_redirect_hops": 3,
  }
}

test_allow_when_all_good {
  ethics.allow with input as base_ok
  not ethics.deny with input as base_ok
  ethics.output.allow with input as base_ok
}

test_deny_when_degraded {
  in := object.union(base_ok, {"degraded": true})
  ethics.deny with input as in
  not ethics.allow with input as in
  ethics.output.deny with input as in
}

test_deny_private_ipv6 {
  in := object.union(base_ok, {
    "network": object.union(base_ok.network, {"resolved_ip": "::1"})
  })
  ethics.deny with input as in
  reasons := ethics.output.reasons with input as in
  reasons[_] == "private_target"
}

test_deny_ttl_short {
  in := object.union(base_ok, {
    "network": object.union(base_ok.network, {"ttl_sec": 5})
  })
  ethics.deny with input as in
  reasons := ethics.output.reasons with input as in
  r := reasons[_]
  startswith(r, "dns_ttl_below_min:")
}

test_deny_risky_needs_evidence {
  in := object.union(base_ok, {
    "boundary": object.union(base_ok.boundary, {"severity_max": "high"}),
    "evidence": object.union(base_ok.evidence, {
      "domains_distinct": 1,
      "strong_count": 0,
    }),
  })
  ethics.deny with input as in
  reasons := ethics.output.reasons with input as in
  reasons[_] == "need_two_independent_domains"
  reasons[_] == "need_strong_source"
}

test_allow_risky_with_evidence {
  in := object.union(base_ok, {
    "boundary": object.union(base_ok.boundary, {"severity_max": "high"})
  })
  ethics.allow with input as in
  not ethics.deny with input as in
}
