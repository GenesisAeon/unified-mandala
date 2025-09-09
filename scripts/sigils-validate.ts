import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import readline from 'readline';
import { z } from 'zod';
import { normalizeCREP } from '../packages/crep/normalize.ts';

const SigilSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
  path: z.string().optional(),
  summary: z.string().optional(),
  links: z
    .array(
      z.object({
        rel: z.enum(['next', 'prev', 'ref', 'doc']),
        href: z.string(),
      })
    )
    .optional(),
  crep: z
    .union([
      z.number(),
      z.object({
        coherence: z.number().optional(),
        resonance: z.number().optional(),
        emergence: z.number().optional(),
        poetics: z.number().optional(),
      }),
    ])
    .optional(),
});

type Sigil = z.infer<typeof SigilSchema>;

const repoRoot = process.cwd();
const sigilDir = path.join(repoRoot, 'docs', 'sigils');
const jsonlFile = path.join(repoRoot, 'data', 'sigils', 'sigillin.jsonl');
const outDir = path.join(repoRoot, 'out');

const entries: any[] = [];

function pushEntry(entry: Sigil) {
  const norm = normalizeCREP(entry.crep as any);
  entries.push({
    id: entry.id,
    title: entry.title || '',
    tags: entry.tags || [],
    links: entry.links || [],
    crep: norm.score,
    source: entry.path || '',
  });
}

function parseFrontMatter(content: string): any {
  const fm = /^---\n([\s\S]+?)\n---/; // front matter at top
  const match = content.match(fm);
  if (match) {
    try {
      return YAML.parse(match[1]);
    } catch (err) {
      console.warn('Failed to parse front matter:', err);
    }
  }
  return {};
}

function processFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const rel = path.relative(repoRoot, filePath);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let data: any = {};
    if (ext === '.yaml' || ext === '.yml') {
      data = YAML.parse(content);
    } else if (ext === '.json') {
      data = JSON.parse(content);
    } else if (ext === '.md') {
      const fm = parseFrontMatter(content);
      data = fm;
      if (!data.id) data.id = path.basename(filePath, ext);
      if (!data.title) {
        const match = content.match(/^#\s+(.*)/m);
        if (match) data.title = match[1].trim();
      }
    }
    data.path = rel;
    const res = SigilSchema.safeParse(data);
    if (!res.success) {
      console.warn(`Validation failed for ${rel}:`, res.error.issues.map(i => i.message).join(', '));
      return;
    }
    pushEntry(res.data);
  } catch (err) {
    console.warn(`Failed to parse ${rel}:`, err);
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
      const res = SigilSchema.safeParse(obj);
      if (!res.success) {
        console.warn(`Validation failed for JSONL line:`, res.error.issues.map(i => i.message).join(', '));
        continue;
      }
      pushEntry(res.data);
    } catch (err) {
      console.warn(`Failed to parse JSONL line:`, err);
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
  console.log(`Validated ${entries.length} entries`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
