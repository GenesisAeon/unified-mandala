import fs from 'fs';
import path from 'path';
const SINK = path.resolve(process.cwd(), 'data/mrv/actions');
fs.mkdirSync(SINK, { recursive: true });
const id = 'SMOKE-' + new Date().toISOString().replace(/[:.]/g, '-');
const decision = {
  id,
  ts: new Date().toISOString(),
  actor: 'co',
  domain: 'hydro',
  context: { region: 'Köln', reason: 'smoke' },
  expected: { cso_overflow_minutes: -5 },
  guardrails: { max_daily_change_pct: 10 },
  action: { cso_setpoint_shift_pct: 2 },
};
const outcome = {
  id,
  ts: new Date().toISOString(),
  observed: { cso_overflow_minutes: -4 },
  notes: 'smoke-ok',
};
fs.writeFileSync(path.join(SINK, `${id}.decision.json`), JSON.stringify(decision, null, 2));
fs.writeFileSync(path.join(SINK, `${id}.outcome.json`), JSON.stringify(outcome, null, 2));
const d = JSON.parse(fs.readFileSync(path.join(SINK, `${id}.decision.json`), 'utf8'));
const o = JSON.parse(fs.readFileSync(path.join(SINK, `${id}.outcome.json`), 'utf8'));
if (d.id === id && o.id === id) {
  console.log('MRV smoke OK:', id);
  process.exit(0);
}
console.error('MRV smoke FAIL');
process.exit(1);
