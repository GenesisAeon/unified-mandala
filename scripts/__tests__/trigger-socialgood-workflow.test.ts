import { describe, it, expect, vi } from 'vitest';

describe('trigger-socialgood-workflow script', () => {
  it('calls parsing and socialgood endpoints', async () => {
    const fetchMock = vi.fn().mockResolvedValue({});
    // @ts-ignore
    global.fetch = fetchMock;
    // @ts-ignore
    await import('../trigger-socialgood-workflow.js');
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'http://localhost:3000/usecases/todo/parse');
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'http://localhost:3000/socialgood/match');
  });
});
