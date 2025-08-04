import { validateSchema } from './index';

describe('validateSchema', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number', minimum: 0 }
    },
    required: ['name', 'age'],
    additionalProperties: false
  };

  it('accepts valid data', () => {
    const result = validateSchema(schema, { name: 'Alice', age: 30 });
    expect(result).toEqual({ valid: true });
  });

  it('returns errors for invalid data', () => {
    const result = validateSchema(schema, { name: 'Bob', age: -1 });
    expect(result.valid).toBe(false);
    expect(result.errors && result.errors.length).toBeGreaterThan(0);
  });
});
