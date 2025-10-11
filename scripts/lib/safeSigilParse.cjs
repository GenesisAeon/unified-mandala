const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');
const matter = require('gray-matter');
const stripJsonComments = require('strip-json-comments');

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function snippetAt(text, line) {
  if (!line || line < 1) return undefined;
  const lines = text.split(/\r?\n/);
  const from = Math.max(0, line - 3);
  const to = Math.min(lines.length, line + 2);
  return lines
    .slice(from, to)
    .map((l, i) => `${from + i + 1} | ${l}`)
    .join('\n');
}

function parseYaml(text) {
  return YAML.parse(text, {
    strict: false,
    customTags: [],
    uniqueKeys: false,
  });
}

function safeParseSigilFile(file) {
  const ext = path.extname(file).toLowerCase();
  const raw = readText(file);
  try {
    if (ext === '.yaml' || ext === '.yml') {
      const data = parseYaml(raw);
      return { ok: true, data, source: { file, format: 'yaml' } };
    }
    if (ext === '.json') {
      const json = JSON.parse(stripJsonComments(raw));
      return { ok: true, data: json, source: { file, format: 'json' } };
    }
    if (ext === '.jsonl') {
      const lines = raw.split(/\r?\n/).filter(Boolean);
      const out = [];
      const errs = [];
      lines.forEach((line, idx) => {
        try {
          out.push(JSON.parse(stripJsonComments(line)));
        } catch (e) {
          errs.push({ idx, err: e.message, line });
        }
      });
      if (errs.length) {
        return {
          ok: false,
          error: { message: `JSONL had ${errs.length} malformed line(s)` },
          source: { file, format: 'jsonl' },
        };
      }
      return { ok: true, data: out, source: { file, format: 'jsonl' } };
    }
    if (ext === '.md' || ext === '.markdown') {
      const fm = matter(raw);
      const data = fm.data && Object.keys(fm.data).length ? fm.data : {};
      if (fm.content?.trim()) data.summary = data.summary ?? fm.content.trim().slice(0, 800);
      return { ok: true, data, meta: { fm: true }, source: { file, format: 'md' } };
    }
    const data = parseYaml(raw);
    return { ok: true, data, source: { file, format: 'yaml-fallback' } };
  } catch (e) {
    const line = typeof e.linePos?.line === 'number' ? e.linePos.line : (e.lineNumber ?? undefined);
    const col = typeof e.linePos?.col === 'number' ? e.linePos.col : (e.column ?? undefined);
    return {
      ok: false,
      error: { message: e.message || String(e), line, col, snippet: snippetAt(raw, line) },
      source: { file, format: ext.slice(1) || 'unknown' },
    };
  }
}

module.exports = { safeParseSigilFile };
