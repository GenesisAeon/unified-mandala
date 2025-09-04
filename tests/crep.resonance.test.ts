import { describe, it, expect } from "vitest";
import { resonanceFromIntents } from "../packages/crep/resonance";

describe("resonanceFromIntents", () => {
  it("is high for uniform intents", () => {
    const r = resonanceFromIntents(Array(20).fill("assert") as any);
    expect(r).toBeGreaterThan(0.95);
  });
  it("is low for mixed intents", () => {
    const mix = ["query","assert","ritual","assert","query","ritual","assert","query","ritual","assert"];
    const r = resonanceFromIntents(mix as any);
    expect(r).toBeLessThan(0.6);
  });
});
