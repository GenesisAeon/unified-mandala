package ethics

default deny = false

deny {
  input.evidence_domains_distinct < 2
}

deny {
  input.claim_type == "factual"
  not strong_source_present
}

strong_source_present {
  some i
  input.evidence[i].strength == "strong"
}

deny {
  input.intent == "impersonation"
}

deny {
  input.intent == "payment_scam"
}

deny {
  input.intent == "malware"
}

deny {
  input.degraded == true
}
