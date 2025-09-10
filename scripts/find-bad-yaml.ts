import glob from "fast-glob";
import { safeParseSigilFile } from "./lib/safeSigilParse.ts";

(async () => {
  const files = await glob(["docs/**/*.{yaml,yml,md,json,jsonl}","sigils/**/*.*"], { onlyFiles: true });
  let bad = 0;
  for (const f of files) {
    const r = safeParseSigilFile(f);
    if (!r.ok) {
      bad++;
      const e = r.error;
      console.log(`✖ ${f}`);
      if (e.line) console.log(`  → line ${e.line}, col ${e.col ?? "?"}`);
      if (e.snippet) console.log(e.snippet.split("\n").map(s=>"    "+s).join("\n"));
      console.log(`  ${e.message}\n`);
    }
  }
  console.log(`Scanned ${files.length} files → ${bad} malformed.`);
  process.exit(bad ? 1 : 0);
})();

