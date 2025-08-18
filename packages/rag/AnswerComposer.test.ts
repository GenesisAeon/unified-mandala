import { AnswerComposer, ModelRouter } from './AnswerComposer';
import { DocRecord } from './DocStore';

describe('AnswerComposer', () => {
  it('generates answer and returns citations', async () => {
    const router: ModelRouter = {
      async generate(prompt: string) {
        expect(prompt).toContain('Question: What?');
        return 'Because [1]';
      },
    };
    const docs: DocRecord[] = [{ id: 'doc1', text: 'fact', source: 'src' , createdAt: 0, updatedAt: 0}];
    const composer = new AnswerComposer(router);
    const res = await composer.compose('What?', docs);
    expect(res.answer).toBe('Because [1]');
    expect(res.citations[0].id).toBe('doc1');
    expect(res.citations[0].source).toBe('src');
  });
});
