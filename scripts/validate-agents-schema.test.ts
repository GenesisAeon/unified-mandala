import { describe, it, expect } from 'vitest';
import path from 'path';
import { validateAgentsSchema } from './validate-agents-schema';

describe('validateAgentsSchema', () => {
  it('detects missing fields', () => {
    const file = path.join(__dirname, '../tests/fixtures/agents-invalid.md');
    const res = validateAgentsSchema(file);
    expect(res.missingStart).toEqual(['NoStartAgent']);
    expect(res.missingRoles).toEqual(['NoRolesAgent']);
    expect(res.missingDocs).toEqual(['NoDocsAgent']);
  });

  it('passes on valid AGENTS.md', () => {
    const file = path.join(__dirname, '../AGENTS.md');
    const res = validateAgentsSchema(file);
    expect(res.missingStart).toEqual([]);
    expect(res.missingRoles).toEqual([]);
    expect(res.missingDocs).toEqual([]);
  });
});
