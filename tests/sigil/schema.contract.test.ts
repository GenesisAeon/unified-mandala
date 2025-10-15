import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../schemas/sigil-message.schema.json';
import { buildSigilMessage } from '../../src/adapters/sigil-mapping';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema as any);

describe('SigilMessage schema contract', () => {
  it('buildSigilMessage creates schema-valid payloads', () => {
    const msg = buildSigilMessage({
      symbol: '!!',
      intent: 'warn',
      context: 'membrane',
      meta: { ts: new Date().toISOString(), source: 'test', crep: { coherence: 0.7 } },
    });
    expect(validate(msg)).toBe(true);
  });
});
