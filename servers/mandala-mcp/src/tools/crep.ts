import fs from 'node:fs';
import path from 'node:path';
import { ResonanceOut, ResonanceOutSchema } from '../types.js';
import { buildUrl, safeFetchJson } from './_net.js';
import { getRepoRoot } from '../utils/paths.js';

function defaultResonance(): ResonanceOut {
  return { resonance: 0 };
}

function readLocalResonance(): ResonanceOut {
  try {
    const repoRoot = getRepoRoot();
    const file = path.resolve(repoRoot, 'data', 'crep-resonance.json');
    if (!fs.existsSync(file)) {
      return defaultResonance();
    }
    const parsed = ResonanceOutSchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
    return parsed.success ? parsed.data : defaultResonance();
  } catch {
    return defaultResonance();
  }
}

export async function loadResonance(): Promise<ResonanceOut> {
  const api = process.env.MANDALA_API;
  if (api) {
    try {
      const url = buildUrl(api, '/api/crep/resonance');
      const json = await safeFetchJson(url);
      const parsed = ResonanceOutSchema.safeParse(json);
      if (parsed.success) {
        return parsed.data;
      }
    } catch (err) {
      if (process.env.DEBUG) {
        console.warn('loadResonance fallback', err);
      }
    }
  }
  return readLocalResonance();
}
