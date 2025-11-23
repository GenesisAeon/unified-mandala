#!/usr/bin/env tsx
/**
 * Boundary Runner (CLI)
 *  - --input <path.json|yaml>  rules file (JSON; YAML optional if 'yaml' is installed)
 *  - --out <path|data://...>   output laws JSON
 *  - --demo                    use built-in demo rules
 *  - --scan <path>             scan a file (can be repeated)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import BoundaryRegistry, { type BoundaryRule } from '@mandala/boundary-core';
import DiscoveryEngine from '@mandala/boundary-engine';

type Args = Record<string, any>;

function parseArgs(): Args {
  const a = process.argv.slice(2);
  const out: Args = {};
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k.startsWith('--')) {
      const key = k.slice(2);
      const next = a[i + 1];
      const isValue = next !== undefined && !String(next).startsWith('--');
      if (key === 'scan') {
        out.scan ??= [];
        if (isValue) {
          out.scan.push(String(next));
          i += 1;
        }
      } else if (isValue) {
        out[key] = next;
        i += 1;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

function resolveDataUri(p: string): string {
  if (p.startsWith('data://')) {
    const tail = p.slice('data://'.length).replace(/^\/+/, '');
    return path.resolve(process.cwd(), 'data', tail);
  }
  return path.resolve(process.cwd(), p);
}

async function readRules(file: string): Promise<BoundaryRule[]> {
  const raw = await fs.readFile(file, 'utf8');
  if (file.endsWith('.json')) return JSON.parse(raw);
  try {
    const yaml = await import('yaml');
    // @ts-ignore
    return yaml.parse(raw) as BoundaryRule[];
  } catch {
    throw new Error("YAML rules require 'yaml' dep. Install: pnpm add -D yaml");
  }
}

async function ensureDirFor(file: string) {
  await fs.mkdir(path.dirname(file), { recursive: true });
}

async function main() {
  const args = parseArgs();
  const useDemo = Boolean(args.demo);
  const outFile = args.out
    ? resolveDataUri(String(args.out))
    : resolveDataUri('data/logs/boundary/laws.json');
  const scans: string[] = Array.isArray(args.scan)
    ? args.scan.map(String)
    : args.scan
      ? [String(args.scan)]
      : [];

  let rules: BoundaryRule[] = [];
  if (useDemo) {
    rules = [
      { id: 'no-todo', description: 'No TODO markers', severity: 'warn', pattern: '\\bTODO\\b' },
      {
        id: 'no-secret',
        description: 'No API_KEY in code',
        severity: 'error',
        pattern: 'API_KEY=.*',
      },
    ];
  } else if (args.input) {
    rules = await readRules(path.resolve(String(args.input)));
  } else {
    throw new Error('Provide --input <rules.json|yaml> or --demo');
  }

  const registry = new BoundaryRegistry().registerMany(rules);
  const engine = new DiscoveryEngine(registry);

  const inputs: { source: string; content: string }[] = [];
  for (const s of scans) {
    const abs = path.resolve(s);
    const content = await fs.readFile(abs, 'utf8').catch(() => '');
    inputs.push({ source: s, content });
  }
  if (inputs.length === 0) {
    const readme = path.resolve(process.cwd(), 'README.md');
    const content = await fs.readFile(readme, 'utf8').catch(() => '');
    inputs.push({ source: 'README.md', content });
  }

  const res = await engine.run(inputs);
  const payload = {
    generated_at: new Date().toISOString(),
    rules_count: res.rulesCount,
    observations_count: res.observationsCount,
    violations_count: res.violationsCount,
    summary: res.summary,
    laws: res.observations,
  };
  await ensureDirFor(outFile);
  await fs.writeFile(outFile, JSON.stringify(payload, null, 2), 'utf8');
  const jsonl = resolveDataUri('data/logs/boundary/laws.jsonl');
  await ensureDirFor(jsonl);
  await fs.appendFile(jsonl, JSON.stringify(payload) + '\n', 'utf8');
  // eslint-disable-next-line no-console
  console.log(`boundary:run ok  ${outFile}`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('boundary:run failed:', e?.message ?? e);
  process.exit(1);
});
