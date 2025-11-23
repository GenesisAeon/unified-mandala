package mandala.ethics_table_test

import data.mandala.ethics as E
import future.keywords.every

base_input := {
  "content": "example",
  "degraded": false,
  "network": {
    "ttl_sec": 300,
    "tls_san_ok": true,
    "redirect_hops": 0,
    "resolved_ip": "93.184.216.34",
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
  },
}

cases := [
  {"name": "green_ok", "patch": {}, "deny": false},
  {"name": "failclosed_degraded", "patch": {"degraded": true}, "deny": true},
  {"name": "deny_low_ttl", "patch": {"network": {"ttl_sec": 5}}, "deny": true},
  {
    "name": "deny_tls_name_mismatch",
    "patch": {"network": {"tls_san_ok": false}},
    "deny": true,
  },
  {
    "name": "deny_missing_strong",
    "patch": {
      "boundary": {"severity_max": "high"},
      "evidence": {"strong_count": 0},
    },
    "deny": true,
  },
]

merge_key(current, base, patch, key) = out {
  patch[key]
  out := object.union(current, {key: object.union(base[key], patch[key])})
} else = out {
  not patch[key]
  out := current
}

compose(base, patch) = out {
  initial := object.union(base, patch)
  step1 := merge_key(initial, base, patch, "network")
  step2 := merge_key(step1, base, patch, "evidence")
  step3 := merge_key(step2, base, patch, "boundary")
  out := merge_key(step3, base, patch, "policy")
}

test_all_cases() {
  every i in [0 .. count(cases) - 1] {
    c := cases[i]
    in := compose(base_input, c.patch)
    deny := E.deny with input as in
    deny == c.deny
  }
}
