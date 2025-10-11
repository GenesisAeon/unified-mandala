import fs from 'fs';
import path from 'path';
import { loadRegistry, loadAgentModule } from './agent-registry';
import type { Agent } from '../../agents/_shared/types';

function stable(o: any): any {
  if (o === null || typeof o !== 'object') return o;
  if (Array.isArray(o)) return o.map(stable);
  const bad = new Set(['ts', 'timestamp', 'time', 'duration', '_meta']);
  const out: any = {};
  Object.keys(o)
    .sort()
    .forEach((k) => {
      if (bad.has(k)) return;
      out[k] = stable(o[k]);
    });
  return out;
}

async function main() {
  const base = path.resolve('tests/agents/golden');
  if (!fs.existsSync(base)) {
    console.log('No golden tests.');
    process.exit(0);
  }
  const reg = Object.fromEntries(loadRegistry().map((r) => [r.id, r.entry]));
  let fails = 0;
  for (const name of fs.readdirSync(base)) {
    const dir = path.join(base, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    const agentId = name; // Ordnername == agentId
    if (!reg[agentId]) {
      console.warn(`[warn] Agent ${agentId} nicht registriert – übersprungen.`);
      continue;
    }
    const inputPath = path.join(dir, 'input.json');
    const expectedPath = path.join(dir, 'expected.json');
    if (!fs.existsSync(inputPath) || !fs.existsSync(expectedPath)) {
      console.warn(`[warn] fehlende input/expected in ${dir}`);
      continue;
    }
    const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const A = (await loadAgentModule(reg[agentId])) as Agent;
    const out = await A.run(input, {
      logger: () => {},
      rateLimit: async () => {},
      http: async () => {
        throw new Error('no-http-in-golden');
      },
      guard: { ensureAllowedDomain: () => {}, consentRequired: false, requestTimeoutMs: 0 },
    } as any);
    const got = stable(out);
    const exp = stable(JSON.parse(fs.readFileSync(expectedPath, 'utf8')));
    const ok = JSON.stringify(got) === JSON.stringify(exp);
    if (!ok) {
      console.error(`[FAIL] ${agentId}`);
      console.error('expected:', JSON.stringify(exp));
      console.error('got     :', JSON.stringify(got));
      fails++;
    } else {
      console.log(`[OK] ${agentId}`);
    }
  }
  process.exit(fails ? 2 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
