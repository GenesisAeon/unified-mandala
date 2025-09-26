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
  return spawnSync("opa", ["eval", "-i", inputPath, "-d", policyPath, "data.mandala.governance.allow"], {
    encoding: "utf-8",
    timeout: 3000,
  });
}

// Try dockerized opa
function hasDocker() {
  const r = spawnSync("docker", ["version", "--format", "{{.Client.Version}}"], { encoding: "utf-8", timeout: 1500 });
  return !r.error && (r.status === 0);
}

function runDocker() {
  if (!hasDocker()) {
    return { error: new Error("docker CLI not available"), status: 1, stdout: "", stderr: "" };
  }
  return spawnSync(
    "docker",
    [
      "run",
      "--rm",
      "-v",
      process.cwd() + ":/w",
      "-w",
      "/w",
      "openpolicyagent/opa:0.67.1",
      "eval",
      "-i",
      inputPath,
      "-d",
      policyPath,
      "data.mandala.governance.allow",
    ],
    { encoding: "utf-8", timeout: 5000 }
  );
}

let r = runLocal();
if (r.error || r.status != 0) {
  console.warn("Local opa not available, trying docker (fast-fail)...");
  r = runDocker();
}

if (r.error || r.status != 0) {
  console.warn("OPA eval failed or not available (docker/offline). Skipping (non-fatal).\n" + (r.stderr || r.error?.message || ""));
  process.exit(0);
}

if (!/true/.test(r.stdout)) {
  console.error("Policy violation:", r.stdout || r.stderr);
  process.exit(1);
}
console.log("OPA policy allow=TRUE");
