import { linkTodosWithCREP } from './TodoPriority';

describe('linkTodosWithCREP', () => {
  it('assigns priority based on crep score', () => {
    const result = linkTodosWithCREP(['task'], 0.8);
    expect(result[0]).toEqual({ text: 'task', priority: 'high' });
  });
});
