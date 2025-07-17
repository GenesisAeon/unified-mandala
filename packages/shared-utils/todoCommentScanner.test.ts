import fs from 'fs';
import path from 'path';
import { scanTodoComments } from './todoCommentScanner';

describe('scanTodoComments', () => {
  const tmp = path.join(__dirname, '__todo_test');
  const file = path.join(tmp, 'a.ts');

  beforeAll(() => {
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);
    fs.writeFileSync(file, '// TODO: first\nconst x = 1;\n// TODO second');
  });

  afterAll(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('finds TODO comments in text', () => {
    const content = fs.readFileSync(file, 'utf8');
    const todos = scanTodoComments(content);
    expect(todos).toEqual(['first', 'second']);
  });
});
