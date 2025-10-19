package ethics

default deny = false

deny {
  input.evidence_domains_distinct < 2
}

deny {
  input.intent == "impersonation"
}

deny {
  input.intent == "payment_scam"
}
