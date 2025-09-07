import assert from 'assert';
import { readFileSync } from 'fs';
import path from 'path';
import { emit } from '../packages/mandala-sdk/ts/index';

const base = path.resolve(__dirname, '..');

const ok = JSON.parse(readFileSync(path.join(base, 'fixtures/events/example_ok.json'), 'utf8'));
emit(ok.topic, ok.payload, {
  personhood: ok.governance.level,
  crep_resonance: ok.crep_resonance,
  sigil: ok.sigil,
  governance: ok.governance,
});

const bad = JSON.parse(readFileSync(path.join(base, 'fixtures/events/example_bad_gate.json'), 'utf8'));
assert.throws(() => {
  emit(bad.topic, bad.payload, {
    personhood: bad.governance.level,
    crep_resonance: bad.crep_resonance,
    sigil: bad.sigil,
    governance: bad.governance,
  });
});

console.log('gate_smoke passed');
