import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import readline from 'readline';
import { z } from 'zod';

const repoRoot = process.cwd();
const sigilDir = path.join(repoRoot, 'docs', 'sigils');
const jsonlFile = path.join(repoRoot, 'data', 'sigils', 'sigillin.jsonl');
const outDir = path.join(repoRoot, 'out');

const CREPSchema = z.union([
  z.number().min(0).max(1),
  z.object({
    coherence: z.number().optional(),
    resonance: z.number().optional(),
    emergence: z.number().optional(),
    poetics: z.number().optional(),
  }).passthrough(),
]);

const LinkSchema = z.object({ rel: z.string(), href: z.string() });

const SigilSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
  path: z.string().optional(),
  summary: z.string().optional(),
  links: z.array(LinkSchema).optional(),
  crep: CREPSchema.optional(),
});

interface IndexEntry {
  source: string;
  id: string;
  title: string;
  tags: string[];
  links: { rel: string; href: string }[];
  crep?: { score: number; parts?: Record<string, number> };
}

const entries: IndexEntry[] = [];
let errors = 0;

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

function normalizeCREP(crep: any) {
  if (crep == null) return undefined;
  if (typeof crep === 'number') {
    return { score: clamp(crep) };
  }
  let sum = 0;
  let count = 0;
  const parts: Record<string, number> = {};
  for (const k of ['coherence', 'resonance', 'emergence', 'poetics']) {
    const v = (crep as any)[k];
    if (typeof v === 'number' && !isNaN(v)) {
      const c = clamp(v);
      parts[k] = c;
      sum += c;
      count++;
    }
  }
  if (count === 0) return undefined;
  return { score: sum / count, parts };
}

function processSigil(data: any, filePath: string) {
  try {
    const sigil = SigilSchema.parse(data);
    const norm = normalizeCREP(sigil.crep);
    entries.push({
      source: path.relative(repoRoot, filePath),
      id: sigil.id,
      title: sigil.title || '',
      tags: sigil.tags || [],
      links: sigil.links || [],
      crep: norm,
    });
  } catch (err: any) {
    errors++;
    console.error(`Validation failed for ${path.relative(repoRoot, filePath)}:`);
    console.error(err?.errors || err);
  }
}

function processFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, 'utf8');
  let data: any = {};
  if (ext === '.yaml' || ext === '.yml') {
    try {
      data = YAML.parse(content) || {};
    } catch (err) {
      errors++;
      console.error(`Failed to parse YAML ${path.relative(repoRoot, filePath)}:`, err);
      return;
    }
  } else if (ext === '.json') {
    try {
      data = JSON.parse(content);
    } catch (err) {
      errors++;
      console.error(`Failed to parse JSON ${path.relative(repoRoot, filePath)}:`, err);
      return;
    }
  } else if (ext === '.md') {
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    if (fm) {
      data = YAML.parse(fm[1]) || {};
    }
    const rest = fm ? content.slice(fm[0].length) : content;
    const h1 = rest.match(/^#\s+(.+)/m);
    if (!data.id) data.id = path.basename(filePath, ext);
    if (!data.title && h1) data.title = h1[1].trim();
  }
  if (!data.id) {
    data.id = path.basename(filePath, ext);
  }
  processSigil(data, filePath);
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
      processSigil(obj, file);
    } catch (err) {
      errors++;
      console.error(`Failed to parse JSONL line:`, err);
    }
  }
}

async function main() {
  walk(sigilDir);
  await processJsonl(jsonlFile);
  entries.sort((a, b) => a.id.localeCompare(b.id));
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'sigillin_index.json');
  fs.writeFileSync(outFile, JSON.stringify(entries, null, 2));
  if (errors > 0) {
    console.error(`Sigil validation completed with ${errors} error(s).`);
    process.exit(1);
  } else {
    console.log(`Validated ${entries.length} sigils.`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
