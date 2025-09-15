import fs from 'node:fs';
import path from 'node:path';
import { KpiList, KpiListSchema } from '../types.js';
import { buildUrl, safeFetchJson } from './_net.js';
import { getRepoRoot } from '../utils/paths.js';

function defaultKpiList(): KpiList {
  return { updated: new Date().toISOString(), items: [] };
}

function readLocalKpis(): KpiList {
  try {
    const repoRoot = getRepoRoot();
    const file = path.resolve(repoRoot, 'data', 'kpis.json');
    if (!fs.existsSync(file)) {
      return defaultKpiList();
    }
    const content = fs.readFileSync(file, 'utf8');
    const parsed = KpiListSchema.safeParse(JSON.parse(content));
    return parsed.success ? parsed.data : defaultKpiList();
  } catch {
    return defaultKpiList();
  }
}

export async function loadKpiList(): Promise<KpiList> {
  const api = process.env.MANDALA_API;
  if (api) {
    try {
      const url = buildUrl(api, '/api/kpi/list');
      const json = await safeFetchJson(url);
      const parsed = KpiListSchema.safeParse(json);
      if (parsed.success) {
        return parsed.data;
      }
    } catch (err) {
      // swallow and fallback to local copy
      if (process.env.DEBUG) {
        console.warn('loadKpiList fallback', err);
      }
    }
  }
  return readLocalKpis();
}
