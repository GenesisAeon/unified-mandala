package mandala.ethics

# ——— Defaults & Config ———
default allow := false
default deny := false
default policy_rev := "fraktal114"

default risky_intent := false
default degraded := false

degraded {
  input.degraded == true
}

min_ttl_sec := input.policy.min_ttl_sec with default := 20
max_redirect_hops := input.policy.max_redirect_hops with default := 3

# Private/verbotene Netze (IPv4/IPv6 inkl. Link-Local, ULA, NAT64, Teredo, 6to4)
private_cidrs := {
  "127.0.0.0/8", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16",
  "169.254.0.0/16",
  "::1/128", "fc00::/7", "fe80::/10",
  "64:ff9b::/96",   # NAT64
  "2001::/32",      # Teredo
  "2002::/16"       # 6to4
}

is_private(ip) {
  some cidr
  cidr := private_cidrs[_]
  net.cidr_contains(cidr, ip)
}

# ——— Deny-Bedingungen (produzieren Gründe) ———
reasons[msg] {
  degraded
  msg := "degraded_mode"
}

deny {
  degraded
}

reasons[msg] {
  not input.network.resolved_ip
  msg := "missing_resolved_ip"
}

deny {
  not input.network.resolved_ip
}

reasons[msg] {
  not input.network.ttl_sec
  msg := "missing_ttl_sec"
}

deny {
  not input.network.ttl_sec
}

reasons[msg] {
  input.network.tls_san_ok == false
  msg := "tls_name_mismatch"
}

deny {
  input.network.tls_san_ok == false
}

reasons[msg] {
  is_private(input.network.resolved_ip)
  msg := "private_target"
}

deny {
  is_private(input.network.resolved_ip)
}

reasons[msg] {
  input.network.ttl_sec < min_ttl_sec
  msg := sprintf("dns_ttl_below_min:%d", [min_ttl_sec])
}

deny {
  input.network.ttl_sec < min_ttl_sec
}

reasons[msg] {
  input.network.redirect_hops > max_redirect_hops
  msg := "redirect_hops_exceeded"
}

deny {
  input.network.redirect_hops > max_redirect_hops
}

risky_intent {
  input.boundary.severity_max == "high"
} else = risky_intent {
  input.flags.risky == true
}

reasons[msg] {
  risky_intent
  not sufficient_domains
  msg := "need_two_independent_domains"
}

deny {
  risky_intent
  not sufficient_domains
}

reasons[msg] {
  risky_intent
  not has_strong
  msg := "need_strong_source"
}

deny {
  risky_intent
  not has_strong
}

sufficient_domains {
  input.evidence.domains_distinct >= 2
}

has_strong {
  input.evidence.strong_count >= 1
}

needed_evidence[e] {
  risky_intent
  not sufficient_domains
  e := {"type": "domain_diversity", "min": 2}
}

needed_evidence[e] {
  risky_intent
  not has_strong
  e := {"type": "strong_source", "examples": ["doi", "arxiv", "gov", "who", "wmo"]}
}

allow {
  count({r | deny; r := 1}) == 0
}

output := {
  "allow": allow,
  "deny": deny,
  "reasons": [msg | msg := reasons[_]],
  "needed_evidence": [item | item := needed_evidence[_]],
  "policy_rev": policy_rev
}
