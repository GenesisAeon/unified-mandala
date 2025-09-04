import { describe, it, expect } from "vitest";
import { temperatureToSigil, biodiversityToSigil, wildfireToSigil, groundwaterToSigil } from "../src/adapters/sigil-mapping";

describe("sigil mappings", () => {
  it("temperatureToSigil maps correctly", () => {
    expect(temperatureToSigil(35).symbol).toBe("🔥");
    expect(temperatureToSigil(-2).symbol).toBe("❄️");
    expect(temperatureToSigil(15).symbol).toBe("🌡️");
  });
  it("biodiversityToSigil tiers", () => {
    expect(biodiversityToSigil(150).symbol).toBe("🌿");
    expect(biodiversityToSigil(60).symbol).toBe("🍃");
    expect(biodiversityToSigil(10).symbol).toBe("🦗");
  });
  it("wildfireToSigil thresholds", () => {
    expect(wildfireToSigil(0.8).symbol).toBe("🔥");
    expect(wildfireToSigil(0.5).symbol).toBe("⚠️");
    expect(wildfireToSigil(0.1).symbol).toBe("🟢");
  });
  it("groundwaterToSigil thresholds", () => {
    expect(groundwaterToSigil(-40).symbol).toBe("🧯");
    expect(groundwaterToSigil(-20).symbol).toBe("🚰");
    expect(groundwaterToSigil(  5).symbol).toBe("💧");
  });
});
