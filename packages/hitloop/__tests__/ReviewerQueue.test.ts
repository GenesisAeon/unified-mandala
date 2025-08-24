import { describe, it, expect } from 'vitest';
import { ReviewerQueue } from '../ReviewerQueue';

describe('ReviewerQueue', () => {
  it('enqueues and decides items', () => {
    const q = new ReviewerQueue();
    const id = q.enqueue({ payload: { msg: 'hi' } });
    const item = q.decide(() => true);
    expect(item?.id).toBe(id);
    expect(item?.payload).toEqual({ msg: 'hi' });
  });
});
