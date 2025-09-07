package mandala.governance

default allow = false

# Example rule: high-risk topics require P3
allow {
  input.topic == "governance.override"
  input.personhood == "P3"
}

# General rule: if governance.compliant is true, allow
allow {
  input.governance.compliant == true
}
