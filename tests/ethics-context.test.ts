import { describe, it, expect } from "vitest";
import { checkEthics } from "../packages/ethics/hooks/agent-ethics";

describe("contextual ethics rules", () => {
  it("blocks simple substrings", () => {
    expect(checkEthics("do credential harvest now")).toBe("block");
  });
  it("reviews ritual init", () => {
    expect(checkEthics("start ritual init", "ritual", { phase: "init" })).toBe("review");
  });
  it("allows wildfire status", () => {
    expect(checkEthics("report risk", "assert", { metric: "wildfire_risk", index: 0.7 })).toBe("allow");
  });
  it("reviews groundwater hard alarm", () => {
    expect(checkEthics("alert groundwater", "assert", { metric: "groundwater_delta_cm", delta: -35 })).toBe(
      "review"
    );
  });
  it("allows benign actions by default", () => {
    expect(checkEthics("render chart")).toBe("allow");
  });
});
