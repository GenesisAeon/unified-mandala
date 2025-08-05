import { describe, it, expect } from 'vitest';
import path from 'path';
import { validateNewAdvancedConversations } from './validate-newadvanced-conversations';

describe('validateNewAdvancedConversations', () => {
  it('flags duplicate titles', () => {
    const file = path.join(__dirname, '../tests/fixtures/newadvanced-duplicate-titles.json');
    const res = validateNewAdvancedConversations(file);
    expect(res.duplicateTitles).toEqual(['Foo']);
  });

  it('detects out-of-order message timestamps', () => {
    const file = path.join(
      __dirname,
      '../tests/fixtures/newadvanced-out-of-order.json'
    );
    const res = validateNewAdvancedConversations(file);
    expect(res.outOfOrderConversations).toEqual([0]);
  });
});
