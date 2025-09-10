import fs from "node:fs";
import path from "node:path";
import * as YAML from "yaml";
import matter from "gray-matter";
import stripJsonComments from "strip-json-comments";

export type ParseResult<T = any> = {
  ok: true; data: T; meta?: any; source: { file: string; format: string };
} | {
  ok: false; error: { message: string; line?: number; col?: number; snippet?: string };
  source: { file: string; format: string };
};

function readText(file: string) {
  return fs.readFileSync(file, "utf8");
}

function snippetAt(text: string, line?: number) {
  if (!line || line < 1) return undefined;
  const lines = text.split(/\r?\n/);
  const from = Math.max(0, line - 3);
  const to = Math.min(lines.length, line + 2);
  return lines.slice(from, to).map((l, i) => `${from + i + 1} | ${l}`).join("\n");
}

/** YAML mit fail-safe Optionen (keine benutzerdef. Tags) */
function parseYaml(text: string) {
  return YAML.parse(text, {
    strict: false,
    customTags: [], // blockiert unbekannte Tags
    uniqueKeys: false,
  });
}

export function safeParseSigilFile(file: string): ParseResult {
  const ext = path.extname(file).toLowerCase();
  const raw = readText(file);

  try {
    if (ext === ".yaml" || ext === ".yml") {
      const data = parseYaml(raw);
      return { ok: true, data, source: { file, format: "yaml" } };
    }
    if (ext === ".json") {
      const json = JSON.parse(stripJsonComments(raw));
      return { ok: true, data: json, source: { file, format: "json" } };
    }
    if (ext === ".jsonl") {
      // JSONL → Array von Objekten; fehlerhafte Zeilen werden als Fehler-Item zurückgegeben
      const lines = raw.split(/\r?\n/).filter(Boolean);
      const out: any[] = [];
      const errs: Array<{ idx: number; err: string; line: string }> = [];
      lines.forEach((line, idx) => {
        try { out.push(JSON.parse(stripJsonComments(line))); }
        catch (e: any) { errs.push({ idx, err: e.message, line }); }
      });
      if (errs.length) {
        return {
          ok: false,
          error: { message: `JSONL had ${errs.length} malformed line(s)` },
          source: { file, format: "jsonl" }
        };
      }
      return { ok: true, data: out, source: { file, format: "jsonl" } };
    }
    if (ext === ".md" || ext === ".markdown") {
      // Front-Matter → YAML; Body optional als summary
      const fm = matter(raw);
      const data = fm.data && Object.keys(fm.data).length ? fm.data : {};
      if (fm.content?.trim()) (data as any).summary = (data as any).summary ?? fm.content.trim().slice(0, 800);
      return { ok: true, data, meta: { fm: true }, source: { file, format: "md" } };
    }
    // Fallback: versuch YAML (oft sind .txt/.sigil.yaml falsch benannt)
    const data = parseYaml(raw);
    return { ok: true, data, source: { file, format: "yaml-fallback" } };
  } catch (e: any) {
    const line = typeof e.linePos?.line === "number" ? e.linePos.line : (e.lineNumber ?? undefined);
    const col = typeof e.linePos?.col === "number" ? e.linePos.col : (e.column ?? undefined);
    return {
      ok: false,
      error: { message: e.message || String(e), line, col, snippet: snippetAt(raw, line) },
      source: { file, format: ext.slice(1) || "unknown" }
    };
  }
}

