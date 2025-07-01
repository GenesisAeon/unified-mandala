/* @jest-environment node */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { verifyPluginManifest } from "./blockchain-trust";

const ledgerPath = path.resolve(
  __dirname,
  "../../config/blockchain-ledger.json",
);

describe("blockchain trust", () => {
  const original = fs.existsSync(ledgerPath)
    ? fs.readFileSync(ledgerPath, "utf8")
    : null;
  let privateKey: crypto.KeyObject;

  beforeAll(() => {
    const { publicKey, privateKey: priv } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    privateKey = priv;
    const pubPem = publicKey.export({ type: "pkcs1", format: "pem" }).toString();
    fs.writeFileSync(ledgerPath, JSON.stringify([pubPem]));
  });

  afterAll(() => {
    if (original !== null) {
      fs.writeFileSync(ledgerPath, original);
    } else {
      fs.unlinkSync(ledgerPath);
    }
  });

  it("verifies manifest signature", () => {
    const sign = crypto.createSign("SHA256");
    sign.update("p");
    sign.end();
    const signature = sign.sign(privateKey, "base64");
    const manifest = { name: "p", signature };
    expect(verifyPluginManifest(manifest)).toBe(true);
  });

  it("rejects unknown signature", () => {
    const other = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
    const sign = crypto.createSign("SHA256");
    sign.update("p");
    sign.end();
    const bad = sign.sign(other.privateKey, "base64");
    const manifest = { name: "p", signature: bad };
    expect(verifyPluginManifest(manifest)).toBe(false);
  });
});
