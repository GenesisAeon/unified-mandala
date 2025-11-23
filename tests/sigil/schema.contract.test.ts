import { describe, it, expect } from 'vitest';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import schema from '../../schemas/sigil-message/1-0-0.schema.json';
import { buildSigilMessage } from '../../src/adapters/sigil-mapping';

const ajv = new Ajv({
  allErrors: true,
  strict: true,
  strictRequired: false,
  allowUnionTypes: true,
});
addFormats(ajv);
const validate = ajv.compile(schema as any);

describe('SigilMessage schema contract', () => {
  it('buildSigilMessage creates schema-valid payloads', () => {
    const msg = buildSigilMessage({
      symbol: '⚠️',
      ascii: true,
      asciiSymbol: '!!',
      kpi: 'groundwater',
      state: 'event',
      severity: 'alarm',
      intent: 'escalate',
      A: 0.84,
      dA: 0.21,
      context: {
        source: 'membrane',
        boundaryLawId: 'gw-evt-2025-01',
        notes: 'Threshold exceeded for three consecutive intervals.',
      },
      evidence: ['https://unified.mandala/observability/events/gw-evt-2025-01.json'],
      meta: { region: 'delta' },
    });
    expect(validate(msg)).toBe(true);
  });
});
