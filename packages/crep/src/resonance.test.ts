import { describe, it, expect } from "vitest";
import { computeEntropy, classify, evaluate } from "./resonance";

describe("CREP resonance minimal kernel", () => {
  it("low-entropy vector -> near 0 -> green", () => {
    const h = computeEntropy([1, 0, 0, 0]);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(classify(h)).toBe("green");
  });

  it("balanced vector -> high entropy -> red", () => {
    const h = computeEntropy([1, 1, 1, 1]); // p = 0.25.. => H=2
    expect(h).toBeGreaterThan(1.9);
    expect(classify(h)).toBe("red");
  });

  it("multi-bin split -> mid entropy -> amber", () => {
    const h = computeEntropy([0.4, 0.3, 0.2, 0.1]);
    expect(h).toBeGreaterThan(1.2);
    expect(h).toBeLessThan(2.0);
    expect(classify(h)).toBe("amber");
  });

  it("negative values are clamped to 0", () => {
    const r = evaluate([3, -1, 0, 0]);
    expect(r.n).toBe(4);
    expect(r.level).toBe("green");
  });
});
