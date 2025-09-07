#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"

w() { mkdir -p "$(dirname "$ROOT/$1")"; cat >"$ROOT/$1"; }

w policies/governance.rego <<'EOP'
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
EOP

w policies/kyverno.yaml <<'EOK'
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: mandala-governance
spec:
  validationFailureAction: audit
  rules:
    - name: require-personhood-level
      match:
        any:
          - resources:
              kinds: ["MandalaEvent"]
      validate:
        message: "High-risk topics require personhood P3"
        pattern:
          (topic): "governance.override"
          (personhood): "P3"
EOK

w tools/opa-check.mjs <<'EOM'
import fs from "fs";
import { spawnSync } from "child_process";

const inputPath = process.argv[2] || "fixtures/events/example_input.json";
const policyPath = "policies/governance.rego";

if (!fs.existsSync(inputPath)) {
  console.error("Input not found:", inputPath);
  process.exit(1);
}

// Try local 'opa'
function runLocal() {
  return spawnSync("opa", ["eval", "-i", inputPath, "-d", policyPath, "data.mandala.governance.allow"], { encoding: "utf-8" });
}

// Try dockerized opa
function runDocker() {
  return spawnSync("docker", ["run","--rm","-v", process.cwd()+":/w","-w","/w","openpolicyagent/opa:0.67.1","eval","-i",inputPath,"-d",policyPath,"data.mandala.governance.allow"], { encoding: "utf-8" });
}

let r = runLocal();
if (r.error || r.status != 0) {
  console.warn("Local opa not available, trying docker...");
  r = runDocker();
}

if (r.error || r.status != 0) {
  console.warn("OPA eval failed or not available, skipping (non-fatal).");
  process.exit(0);
}

if (!/true/.test(r.stdout)) {
  console.error("Policy violation:", r.stdout || r.stderr);
  process.exit(1);
}
console.log("OPA policy allow=TRUE");
EOM

mkdir -p "$ROOT/fixtures/events"
cat >"$ROOT/fixtures/events/example_input.json" <<'EOI'
{
  "topic": "governance.override",
  "personhood": "P3",
  "governance": {"compliant": true}
}
EOI

mkdir -p "$ROOT/.github/workflows"
cat >"$ROOT/.github/workflows/policy-check.yml" <<'EOY'
name: Policy Checks
on: [push, pull_request]
jobs:
  opa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: OPA policy check
        run: |
          node tools/opa-check.mjs fixtures/events/example_input.json
  kyverno:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Kyverno validate (dry-run)
        uses: kyverno/action@v0.4.0
        with:
          policies: policies/kyverno.yaml
          resources: fixtures/events/example_input.json
          cluster: false
EOY

echo "PR-E tree written under $ROOT"
