import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import readline from 'readline';
import { normalizeCREP, type CrepNormalized } from '../src/domain/crep.ts';

interface SigilEntry {
  source: string;
  id: string;
  title?: string;
  tags?: any[];
  crep?: any;
  links?: any[];
  CREP?: any;
  score?: any;
  C?: any;
  R?: any;
  E?: any;
  P?: any;
}

const repoRoot = process.cwd();
const sigilDir = path.join(repoRoot, 'docs', 'sigils');
const jsonlFile = path.join(repoRoot, 'data', 'sigils', 'sigillin.jsonl');
const outDir = path.join(repoRoot, 'out');

const entries: {
  source: string;
  id: string;
  title: string;
  tags: any[];
  links: any[];
  crep?: CrepNormalized;
}[] = [];

function pushEntry(entry: SigilEntry) {
  const rawCrep =
    entry.crep ??
    entry.CREP ?? {
      score: entry.score,
      C: entry.C,
      R: entry.R,
      E: entry.E,
      P: entry.P,
    };
  const norm = normalizeCREP(rawCrep);
  const out: {
    source: string;
    id: string;
    title: string;
    tags: any[];
    links: any[];
    crep?: CrepNormalized;
  } = {
    source: entry.source,
    id: entry.id,
    title: entry.title || '',
    tags: entry.tags || [],
    links: entry.links || [],
  };
  if (norm.source !== 'none') {
    out.crep = norm;
  }
  entries.push(out);
}

function processFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const rel = path.relative(repoRoot, filePath);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (ext === '.yaml' || ext === '.yml') {
      const obj = YAML.parse(content) || {};
      pushEntry({
        source: rel,
        id: obj.id || path.basename(filePath, ext),
        title: obj.title || obj.name,
        tags: obj.tags,
        crep: obj.crep,
        links: obj.links,
        CREP: obj.CREP,
        score: obj.score,
        C: obj.C,
        R: obj.R,
        E: obj.E,
        P: obj.P,
      });
    } else if (ext === '.json') {
      const obj = JSON.parse(content);
      pushEntry({
        source: rel,
        id: obj.id || path.basename(filePath, ext),
        title: obj.title,
        tags: obj.tags,
        crep: obj.crep,
        links: obj.links,
        CREP: obj.CREP,
        score: obj.score,
        C: obj.C,
        R: obj.R,
        E: obj.E,
        P: obj.P,
      });
    } else if (ext === '.md') {
      const match = content.match(/^#\s+(.*)/m);
      pushEntry({
        source: rel,
        id: path.basename(filePath, ext),
        title: match ? match[1].trim() : undefined,
      });
    }
  } catch (err) {
    console.error(`Failed to parse ${rel}:`, err);
  }
}

function walk(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full); else processFile(full);
  }
}

async function processJsonl(file: string) {
  if (!fs.existsSync(file)) return;
  const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const obj = JSON.parse(trimmed);
      pushEntry({
        source: path.relative(repoRoot, file),
        id: obj.id,
        title: obj.title,
        tags: obj.tags,
        crep: obj.crep,
        links: obj.links,
        CREP: obj.CREP,
        score: obj.score,
        C: obj.C,
        R: obj.R,
        E: obj.E,
        P: obj.P,
      });
    } catch (err) {
      console.error(`Failed to parse JSONL line:`, err);
    }
  }
}

async function main() {
  walk(sigilDir);
  await processJsonl(jsonlFile);
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'sigillin_index.json');
  fs.writeFileSync(outFile, JSON.stringify(entries, null, 2));
  console.log(`Wrote ${entries.length} entries to ${path.relative(repoRoot, outFile)}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

