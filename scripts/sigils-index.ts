import fs from "node:fs";
import path from "node:path";
import glob from "fast-glob";
import { safeParseSigilFile } from "./lib/safeSigilParse.ts";
import { normalizeCREP } from "../src/domain/crep.ts";

type IndexEntry = {
  id: string;
  title?: string;
  path: string;
  tags?: string[];
  summary?: string;
  crep?: { score: number; parts?: { c?: number; r?: number; e?: number; p?: number }; source?: string };
};

const ROOTS = ["docs/**/*.yaml","docs/**/*.yml","docs/**/*.json","docs/**/*.jsonl","docs/**/*.md","sigils/**/*.*"];

const STRICT = process.env.SIGILS_STRICT === "1";

(async function main() {
  const files = await glob(ROOTS, { dot: false, onlyFiles: true, unique: true });
  const index: IndexEntry[] = [];
  const errors: any[] = [];

  for (const file of files) {
    const res = safeParseSigilFile(file);
    if (!res.ok) {
      errors.push({ file, ...res.error, source: res.source });
      continue;
    }
    const data = res.data || {};
    // robuste ID/Title-Ermittlung
    const id = (data.id || data.slug || path.basename(file).replace(path.extname(file), "")) as string;
    const title = (data.title || data.name || data.sigil || id) as string;
    const tags = (data.tags && Array.isArray(data.tags)) ? data.tags : undefined;

    // CREP: vorhandene Form respektieren → normalisieren
    const rawCrep = data.crep ?? {
      score: data.score,
      // Legacy Großbuchstaben (nicht überschreiben!)
      C: data.C, R: data.R, E: data.E, P: data.P
    };
    const crepNorm = normalizeCREP(rawCrep);
    const crep = crepNorm.source !== "none" ? { score: crepNorm.score, parts: crepNorm.parts, source: crepNorm.source } : undefined;

    const entry: IndexEntry = {
      id, title, path: file, tags,
      summary: data.summary || data.description || data.desc,
      crep
    };
    index.push(entry);
  }

  fs.mkdirSync("out", { recursive: true });
  fs.writeFileSync("out/sigillin_index.json", JSON.stringify(index, null, 2), "utf8");
  fs.writeFileSync("out/sigils_errors.json", JSON.stringify(errors, null, 2), "utf8");

  const errCount = errors.length;
  console.log(`sigils:index → wrote ${index.length} entries, ${errCount} error(s).`);
  if (STRICT && errCount > 0) {
    console.error("STRICT mode: failing due to parse errors. See out/sigils_errors.json");
    process.exit(1);
  }
})();

