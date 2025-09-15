import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type MutableEnv = NodeJS.ProcessEnv & Record<string, string | undefined>;

const originalEnv = process.env;

describe("feature flags", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv } as MutableEnv;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("exposes stable defaults for the core", async () => {
    const { isOn } = await import("../../src/config/featureFlags");
    expect(isOn("climateCore")).toBe(true);
    expect(isOn("universeSimulation")).toBe(false);
    expect(isOn("quantumBridge")).toBe(false);
  });

  it("respects process environment overrides", async () => {
    process.env.UM_FEATURE_PROMPT_COACH = "off";
    const { isOn } = await import("../../src/config/featureFlags");
    expect(isOn("promptCoach")).toBe(false);
  });

  it("forces the membrane off when LOW_MEM is set", async () => {
    process.env.LOW_MEM = "true";
    const { isOn } = await import("../../src/config/featureFlags");
    expect(isOn("membrane")).toBe(false);
  });

  it("normalises boolean-like inputs for experimental flags", async () => {
    process.env.UM_FEATURE_UNIVERSE_SIM = "1";
    const { isOn, whenFeature } = await import("../../src/config/featureFlags");
    expect(isOn("universeSimulation")).toBe(true);
    expect(whenFeature("universeSimulation", "enabled", "disabled")).toBe("enabled");
  });
});
