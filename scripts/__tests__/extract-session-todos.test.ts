import * as path from 'path';
const { extractSessionTodos } = require('../parse-newadvanced-conversations');

describe('extractSessionTodos', () => {
  const file = path.join(__dirname, 'fixtures/newadvancedconversations-todos.json');

  it('extracts TODO lines from specified session titles', () => {
    const tasks = extractSessionTodos(file, ['Todo Session']);
    expect(tasks).toEqual([
      {
        commit: 'TODO: implement feature',
        path: '',
        task: 'TODO: implement feature',
        test: '',
        status: 'planned',
      },
      {
        commit: '- TODO: fix bug',
        path: '',
        task: 'TODO: fix bug',
        test: '',
        status: 'planned',
      },
    ]);
  });
});
