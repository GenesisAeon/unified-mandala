import { isFragmentProcessed, markFragmentProcessed, listProcessedFragments } from './conversationProgress';
import fs from 'fs';
import path from 'path';

describe('conversationProgress', () => {
  const file = path.join(__dirname, 'test-progress.json');
  afterEach(() => { if (fs.existsSync(file)) fs.unlinkSync(file); });

  it('marks and checks fragments', () => {
    expect(isFragmentProcessed('a', file)).toBe(false);
    markFragmentProcessed('a', file);
    expect(isFragmentProcessed('a', file)).toBe(true);
    const list = listProcessedFragments(file);
    expect(list).toContain('a');
  });
});
