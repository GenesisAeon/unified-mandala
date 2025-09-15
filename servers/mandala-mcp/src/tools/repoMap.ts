import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import { RepoMap, RepoMapEntry, RepoMapSchema } from '../types.js';
import { assertUnderRepoRoot } from '../security/allowlist.js';
import { getRepoRoot } from '../utils/paths.js';
import { z } from 'zod';

const AnalysisEntrySchema = z.object({
  path: z.string(),
  type: z.string(),
  name: z.string().optional(),
  meta: z.record(z.unknown()).optional()
});

function baseFallback(): RepoMap {
  return {
    name: 'Unified Mandala RepoMap',
    updated: new Date().toISOString(),
    ebenen: [
      {
        id: 'core',
        title: 'Core',
        description: 'Minimal fallback RepoMap',
        entries: []
      }
    ]
  };
}

function toRepoEntries(items: z.infer<typeof AnalysisEntrySchema>[]): RepoMapEntry[] {
  return items.map((item) => ({
    id: item.path,
    name: item.name ?? path.basename(item.path),
    path: item.path,
    type: item.type,
    meta: item.meta
  }));
}

function tryParseRepoMap(file: string): RepoMap | null {
  try {
    const ext = path.extname(file).toLowerCase();
    const raw = fs.readFileSync(file, 'utf8');
    if (ext === '.yaml' || ext === '.yml') {
      const parsed = RepoMapSchema.safeParse(yaml.parse(raw));
      return parsed.success ? parsed.data : null;
    }
    const json = JSON.parse(raw);
    const parsed = RepoMapSchema.safeParse(json);
    if (parsed.success) {
      return parsed.data;
    }
    const analysis = z.array(AnalysisEntrySchema).safeParse(json);
    if (analysis.success) {
      return {
        name: 'Unified Mandala RepoMap',
        updated: new Date().toISOString(),
        ebenen: [
          {
            id: 'analysis',
            title: 'Repo Items',
            entries: toRepoEntries(analysis.data)
          }
        ]
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function loadRepoMap(): RepoMap {
  const repoRoot = getRepoRoot();
  const candidates = [
    path.resolve(repoRoot, 'docs', 'RepoMap.yaml'),
    path.resolve(repoRoot, 'docs', 'RepoMap.yml'),
    path.resolve(repoRoot, 'docs', 'RepoMap.json'),
    path.resolve(repoRoot, 'analysis', 'repo-map.json')
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    try {
      assertUnderRepoRoot(candidate);
      const map = tryParseRepoMap(candidate);
      if (map) {
        return map;
      }
    } catch {
      // ignore and try next
    }
  }
  return baseFallback();
}
