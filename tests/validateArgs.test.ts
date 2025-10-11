import { validateArgs } from '../packages/gpt-bridges/tools/validateArgs';

describe('validateArgs', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' },
    },
    required: ['name'],
    additionalProperties: false,
  };

  it('accepts valid arguments', () => {
    expect(() => validateArgs(schema, { name: 'Alice', age: 30 })).not.toThrow();
  });

  it('throws on invalid arguments', () => {
    expect(() => validateArgs(schema, { age: 10 })).toThrow(/Invalid tool arguments/);
  });
});
