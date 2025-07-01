import fs from "fs";
import path from "path";
import { verifyPluginManifest } from "./blockchain-trust";

const ledgerPath = path.resolve(
  __dirname,
  "../../config/blockchain-ledger.json",
);

describe("blockchain trust", () => {
  const original = fs.existsSync(ledgerPath)
    ? fs.readFileSync(ledgerPath, "utf8")
    : null;

  beforeAll(() => {
    fs.writeFileSync(ledgerPath, JSON.stringify(["test-sig"]));
  });

  afterAll(() => {
    if (original !== null) {
      fs.writeFileSync(ledgerPath, original);
    } else {
      fs.unlinkSync(ledgerPath);
    }
  });

  it("verifies manifest signature", () => {
    const manifest = { name: "p", signature: "test-sig" };
    expect(verifyPluginManifest(manifest)).toBe(true);
  });

  it("rejects unknown signature", () => {
    const manifest = { name: "p", signature: "bad" };
    expect(verifyPluginManifest(manifest)).toBe(false);
  });
});
