import { describe, it, expect } from "vitest";
import { checkEthics } from "../packages/ethics/hooks/agent-ethics";

describe("agent ethics", () => {
  it("throws on violating actions", () => {
    expect(() => checkEthics("Probiere credential harvest bei X")).toThrow();
  });
  it("passes benign actions", () => {
    expect(() => checkEthics("Zeige Diagramm an")).not.toThrow();
  });
});
