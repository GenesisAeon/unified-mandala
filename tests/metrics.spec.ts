import { describe, expect, test } from "vitest";
import { interAdapterResonance } from "../src/utils/resonance";
import { calculateMetrics } from "../src/utils/calculateMetrics";

describe("metrics", () => {
  test("emergencePotential scales with connections", () => {
    const m = calculateMetrics(
      { connections: ["a", "b"], crep: { parts: { emergence: 0.8 } } } as any,
      10
    );
    expect(m.emergencePotential).toBeCloseTo(0.8 * 0.2, 3);
  });
});

test("interAdapterResonance works", () => {
  expect(interAdapterResonance(0.8, 0.9)).toBeGreaterThan(0);
});
