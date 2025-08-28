import { summarizeNewAdvancedConversations } from '../summarize-newadvanced-conversations';
import * as path from 'path';

describe('summarizeNewAdvancedConversations', () => {
  it('summarizes titles and node counts', async () => {
    const file = path.join(__dirname, 'fixtures/newadvancedconversations-small.json');
    const summaries = await summarizeNewAdvancedConversations(file);
    expect(summaries).toEqual([
      { title: 'Session A', nodes: 2 },
      { title: 'Session B', nodes: 0 },
    ]);
  });

  it('respects limit option', async () => {
    const file = path.join(__dirname, 'fixtures/newadvancedconversations-small.json');
    const summaries = await summarizeNewAdvancedConversations(file, 1);
    expect(summaries).toEqual([{ title: 'Session A', nodes: 2 }]);
  });
});
