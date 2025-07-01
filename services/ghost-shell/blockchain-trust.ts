import fs from "fs";
import path from "path";

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
  return ledger.includes(manifest.signature);
}
