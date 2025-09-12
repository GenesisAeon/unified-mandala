import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("adapters_index.json", () => {
  it("contains OISST", () => {
    const p = "out/adapters_index.json";
    expect(fs.existsSync(p)).toBe(true);
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    expect(Array.isArray(j.adapters)).toBe(true);
    expect(j.adapters.some((a: any) => a?.kind === "oisst")).toBe(true);
  });
});
