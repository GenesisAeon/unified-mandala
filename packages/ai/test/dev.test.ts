import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock index exports used by dev.ts
vi.mock('../src/index.js', () => ({
  askOpenAI: vi.fn(async () => ({ text: 'DEV-OK', model: 'mock' })),
}));

describe('dev script', () => {
  let logSpy: any;
  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockRestore();
  });

  it('runs main and logs output', async () => {
    await import('../src/dev');
    expect(logSpy).toHaveBeenCalled();
  });
});

