#!/usr/bin/env ts-node
import { readFileSync, writeFileSync } from "fs";
import path from "path";

type Choice = { id: string; diff: string; priority: "HIGH"|"MEDIUM"|"LOW"; tests: string[] };

function load(p: string) { return readFileSync(p, "utf8"); }

const inputs = {
  index: load("out/sigillin_index.json"),
  errs:  (()=>{ try{ return load("out/sigils_errors.json"); }catch{ return "[]"; } })(),
  docs:  load("SIGILLIN_GENESIS.md")
};

// In your runtime, call the Archivist model here.
// For now we scaffold a stub that reads prompts and writes a TODO patch file.
const prompt = [
  load("prompts/emergence-scan.md"),
  "\n\n# Artifacts\n",
  "## sigillin_index.json\n", inputs.index.slice(0, 8000),
  "\n## sigils_errors.json\n", inputs.errs.slice(0, 4000),
].join("");

writeFileSync("out/agent_archivist_input.txt", prompt);
console.log("✍️  Wrote prompt to out/agent_archivist_input.txt");
// A real run would POST `prompt` to your model endpoint and write diffs into out/archivist_patches.md
