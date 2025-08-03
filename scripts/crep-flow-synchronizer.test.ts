import { mkdtempSync, writeFileSync, readFileSync } from "fs";
import os from "os";
import path from "path";
import { syncCREP } from "./crep-flow-synchronizer";

describe("syncCREP", () => {
  it("merges source into target", () => {
    const tmp = mkdtempSync(path.join(os.tmpdir(), "crep-test-"));
    const source = path.join(tmp, "source");
    const target = path.join(tmp, "target");
    const fs = require("fs");
    fs.mkdirSync(source);
    fs.mkdirSync(target);
    writeFileSync(
      path.join(source, "crep.json"),
      JSON.stringify({ score: 0.8, events: ["a"] }),
    );
    writeFileSync(
      path.join(target, "crep.json"),
      JSON.stringify({ score: 0.5, notes: ["old"] }),
    );

    syncCREP(source, target);

    const result = JSON.parse(
      readFileSync(path.join(target, "crep.json"), "utf8"),
    );
    expect(result).toEqual({ score: 0.8, notes: ["old"], events: ["a"] });
  });
});
