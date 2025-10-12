import { describe, it, expect } from 'vitest';

describe('guards/guardedFs', () => {
  it('write/read/exists on scratch://', async () => {
    const { writeFileURI, readFileURI, existsURI } = await import('../src/guards/guardedFs.js');
    const uri = 'scratch://vitest/tmp/sample.txt';
    const payload = 'hello';
    const w = await writeFileURI(uri, payload);
    expect(w.ok).toBe(true);
    expect(await existsURI(uri)).toBe(true);
    expect(await readFileURI(uri)).toBe(payload);
  });

  it('forbids writes to repo://', async () => {
    const { writeFileURI } = await import('../src/guards/guardedFs.js');
    await expect(writeFileURI('repo://README.md', 'x')).rejects.toThrow(/forbidden/i);
  });
});

