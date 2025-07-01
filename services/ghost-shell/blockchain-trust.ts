import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface PluginManifest {
  name: string;
  signature: string;
}

const ledgerPath = path.resolve(
  __dirname,
  "../../config/blockchain-ledger.json",
);

export function verifyPluginManifest(manifest: PluginManifest): boolean {
  if (!fs.existsSync(ledgerPath)) return false;
  const data = fs.readFileSync(ledgerPath, "utf8");
  const ledger = JSON.parse(data) as string[];
  for (const pub of ledger) {
    try {
      const verify = crypto.createVerify("SHA256");
      verify.update(manifest.name);
      verify.end();
      if (verify.verify(pub, manifest.signature, "base64")) {
        return true;
      }
    } catch {
      continue;
    }
  }
  return false;
}
