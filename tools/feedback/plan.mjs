import fs from "fs";
const input = process.argv[2] || "feedback/aggregated.json";
const agg = JSON.parse(fs.readFileSync(input, "utf-8"));
function collectChangespecYamls() {
  const list = [];
  for (const doc of agg) {
    for (const b of doc.blocks) {
      if (b.lang === "yaml" && /changes:/.test(b.content)) {
        list.push({ from: doc.file, yaml: b.content });
      }
    }
  }
  return list;
}
function collectDiffs() {
  const list = [];
  for (const doc of agg) {
    for (const b of doc.blocks) {
      if (b.lang === "diff") {
        list.push({ from: doc.file, title: b.title, diff: b.content });
      }
    }
  }
  return list;
}
const cs = {
  meta: {
    generated_at: new Date().toISOString(),
    sources: agg.map(a => a.file)
  },
  diffs: collectDiffs(),
  changespecs: collectChangespecYamls()
};
fs.writeFileSync("CHANGESET.yaml", [
  "meta:",
  `  generated_at: "${cs.meta.generated_at}"`,
  `  sources:`,
  ...cs.meta.sources.map(s => `    - "${s}"`),
  "diffs:",
  ...cs.diffs.map(d => {
    const patch = d.diff.split("\n").map(l => "      " + l).join("\n");
    return `  - from: "${d.from}"\n    title: "${d.title || ""}"\n    patch: |\n${patch}`;
  }),
  "changespecs:",
  ...cs.changespecs.map(c => {
    const spec = c.yaml.split("\n").map(l => "      " + l).join("\n");
    return `  - from: "${c.from}"\n    spec: |\n${spec}`;
  })
].join("\n") + "\n");
console.log("Wrote CHANGESET.yaml");
