import assert from "assert";
import { createContrastivePair } from "./main";

const pair = createContrastivePair("sky is green", "sky is blue");
assert.equal(pair.hallucination, "sky is green");
assert.equal(pair.fact, "sky is blue");
assert.ok(pair.contrast > 0);
