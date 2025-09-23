import { describe, it, expect } from "vitest";
import {
  computeCoherence,
  computeResonance,
  computeEmergence,
  computePoetics,
  computeCREP,
  type Graph,
} from "../src/crep";

describe("CREP metrics", () => {
  const base: Graph = {
    nodes: ["a", "b", "c", "d"],
    edges: [
      { source: "a", target: "b", weight: 1 },
      { source: "b", target: "c", weight: 1 },
      { source: "c", target: "d", weight: 1 },
    ],
    labels: {
      a: 0,
      b: 0,
      c: 1,
      d: 1,
    },
  };

  it("computes coherence within [0,1]", () => {
    const value = computeCoherence(base);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1);
  });

  it("returns neutral resonance when no history is provided", () => {
    const value = computeResonance(undefined, base);
    expect(value).toBeCloseTo(0.5, 5);
  });

  it("reduces emergence when additional bridges are added", () => {
    const reference = computeEmergence(base);
    const variant: Graph = {
      ...base,
      edges: [...base.edges, { source: "a", target: "c", weight: 1 }],
    };
    const emergent = computeEmergence(variant);
    expect(emergent).toBeLessThanOrEqual(reference);
  });

  it("prefers balanced clusters and lower density for poetics", () => {
    const poetic = computePoetics(base);
    expect(poetic).toBeGreaterThan(0);
    expect(poetic).toBeLessThanOrEqual(1);
  });

  it("aggregates into an overall CREP score", () => {
    const result = computeCREP(base);
    const mean =
      (result.coherence + result.resonance + result.emergence + result.poetics) / 4;
    expect(result.crep).toBeCloseTo(mean);
  });
});
