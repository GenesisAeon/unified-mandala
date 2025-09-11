import fs from "fs";
import yaml from "js-yaml";

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

const fp = process.argv[2];
const doc: any = yaml.load(fs.readFileSync(fp, "utf8"));
const c: any = doc?.crep;
const arr = [c?.coherence, c?.resonance, c?.emergence, c?.poetics] as number[];
assert(typeof doc?.id === "string", "missing id");
assert(c && arr.every((n) => typeof n === "number"), "invalid crep");
assert(arr.every((n) => n >= 0 && n <= 1), "crep out of range");
console.log("✅ Valid sigil");
