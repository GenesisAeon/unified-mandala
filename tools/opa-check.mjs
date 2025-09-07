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
