import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';

const OLD_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('guards/pathBroker', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV } as any;
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('resolves repo:// to absolute path, not writable', async () => {
    const { resolve } = await import('../src/guards/pathBroker.js');
    const r = resolve('repo://README.md');
    expect(r.writable).toBe(false);
    expect(path.isAbsolute(r.abs)).toBe(true);
    expect(r.abs.toLowerCase()).toContain('unified-mandala');
  });

  it('resolves scratch:// to .ai-scratch and is writable', async () => {
    const { resolve } = await import('../src/guards/pathBroker.js');
    const r = resolve('scratch://tmp/test.txt');
    expect(r.writable).toBe(true);
    expect(r.abs.toLowerCase()).toContain('.ai-scratch');
  });

  it('resolves data:// with AI_DATA_ROOT and is writable', async () => {
    process.env.AI_DATA_ROOT = path.resolve(process.cwd(), '.ai-scratch/data-root');
    const { resolve } = await import('../src/guards/pathBroker.js');
    const r = resolve('data://sub/val.txt');
    expect(r.writable).toBe(true);
    expect(r.abs.toLowerCase()).toContain('data-root');
  });

  it('throws for data:// without AI_DATA_ROOT', async () => {
    delete process.env.AI_DATA_ROOT;
    const { resolve } = await import('../src/guards/pathBroker.js');
    expect(() => resolve('data://x/y')).toThrow(/AI_DATA_ROOT/);
  });
});

