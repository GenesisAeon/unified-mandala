package mandala.ethics

default deny = false

default reasons = []

default strong_required = false

default degraded = false

degraded {
  input.degraded == true
}

risky_intent {
  input.intent == "factual"
} else = risky_intent {
  input.intent == "climate"
} else = risky_intent {
  input.risk == "high"
}

has_two_domains {
  input.evidence.domains_distinct >= 2
}

has_strong_evidence {
  input.evidence.strong >= 1
}

deny {
  degraded
}

reasons[msg] {
  degraded
  msg := "service_degraded_fail_closed"
}

deny {
  risky_intent
  not has_two_domains
}

reasons[msg] {
  risky_intent
  not has_two_domains
  msg := sprintf("insufficient_domain_diversity:%v", [input.evidence.domains])
}

deny {
  risky_intent
  not has_strong_evidence
}

reasons[msg] {
  risky_intent
  not has_strong_evidence
  msg := "strong_evidence_required"
}

output := {
  "deny": deny,
  "reasons": reasons,
  "risky": risky_intent,
  "degraded": degraded,
  "evidence": {
    "domains_distinct": input.evidence.domains_distinct,
    "strong": input.evidence.strong,
    "domains": input.evidence.domains,
  },
}
