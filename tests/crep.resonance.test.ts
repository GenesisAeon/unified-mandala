import { describe, it, expect } from "vitest";
import { calculateResonance } from "../packages/crep/resonance";

describe("CREP resonance", () => {
  it("0 for empty", () => {
    expect(calculateResonance([])).toBe(0);
  });
  it("high for uniform intents", () => {
    const sigils = Array.from({length: 10}, () => ({ symbol: "🔥", intent: "assert", context: {}, metadata:{timestamp:new Date().toISOString()} }));
    expect(calculateResonance(sigils)).toBeGreaterThan(0.8);
  });
  it("low for diverse intents", () => {
    const sigils = [
      { symbol:"🔥", intent:"assert", context:{}, metadata:{timestamp:""} },
      { symbol:"🔮", intent:"ritual", context:{}, metadata:{timestamp:""} },
      { symbol:"❓", intent:"query", context:{}, metadata:{timestamp:""} }
    ];
    expect(calculateResonance(sigils)).toBeLessThan(0.7);
  });
});
