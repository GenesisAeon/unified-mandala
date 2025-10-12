import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock guarded FS helpers
vi.mock('../src/guards/guardedFs.js', () => ({
  readFileURI: vi.fn(async (u: string) => `READ:${u}`),
  writeFileURI: vi.fn(async (u: string, data: string) => `WRITE:${u}:${data.length}`),
}));

// Mock askOpenAI for runtime fallback
vi.mock('../src/ask.js', () => ({
  askOpenAI: vi.fn(async (_p: any) => ({ text: 'hi' })),
}));

import { tools } from '../src/agent/tools';
import { readFileURI, writeFileURI } from '../src/guards/guardedFs.js';
import { askOpenAI } from '../src/ask.js';

describe('agent tools', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('repo.read delegates to readFileURI', async () => {
    const res = await tools['repo.read']({ path: 'a/b.txt' });
    expect(readFileURI).toHaveBeenCalledWith('repo://a/b.txt');
    expect(String(res)).toContain('READ:');
  });

  it('scratch.write delegates to writeFileURI', async () => {
    const res = await tools['scratch.write']({ path: 'x.txt', data: 'abc' });
    expect(writeFileURI).toHaveBeenCalledWith('scratch://x.txt', 'abc');
    expect(String(res)).toContain('WRITE:');
  });

  it('git.propose_patch throws informative error', async () => {
    await expect(tools['git.propose_patch']({})).rejects.toThrow(/external PR/);
  });

  it('runtime.chat uses askOpenAI fallback when no fetch', async () => {
    const g = globalThis as any;
    const originalFetch = g.fetch;
    try {
      delete g.fetch;
      const result: any = await tools['runtime.chat']({ messages: [{ role: 'user', content: 'hi' }] });
      expect(askOpenAI).toHaveBeenCalledTimes(1);
      expect(result.text).toBe('hi');
    } finally {
      g.fetch = originalFetch;
    }
  });

  it('runtime.chat uses fetch and returns JSON', async () => {
    const g = globalThis as any;
    const originalFetch = g.fetch;
    g.fetch = vi.fn(async () => ({ ok: true, json: async () => ({ ok: true, text: 'ok' }) }));
    try {
      const result: any = await tools['runtime.chat']({ messages: [{ role: 'user', content: 'hi' }] });
      expect(result).toMatchObject({ ok: true, text: 'ok' });
    } finally {
      g.fetch = originalFetch;
    }
  });

  it('runtime.chat throws on non-ok fetch', async () => {
    const g = globalThis as any;
    const originalFetch = g.fetch;
    g.fetch = vi.fn(async () => ({ ok: false, status: 500, text: async () => 'boom' }));
    await expect(
      tools['runtime.chat']({ messages: [{ role: 'user', content: 'hi' }] }),
    ).rejects.toThrow(/runtime\.chat failed/);
    g.fetch = originalFetch;
  });

  it('runtime.chat validates non-empty messages', async () => {
    await expect(tools['runtime.chat']({ messages: [] as any })).rejects.toThrow(/at least one/);
  });
});
