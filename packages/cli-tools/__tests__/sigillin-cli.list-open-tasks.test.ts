import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('list-open-tasks command', () => {
  const tmpDir = path.join(__dirname, '__tmp_list__');
  const todoFile = path.join(tmpDir, 'advancedToDo.yaml');

  beforeAll(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(
      todoFile,
      '- commit: test\n  path: test.ts\n  task: sample task\n  status: todo\n',
    );
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('outputs open tasks without ts-node', () => {
    const cli = path.resolve(__dirname, '..', 'sigillin-cli.js');
    const out = execSync(`node ${cli} list-open-tasks ${todoFile}`).toString();
    expect(out).toContain('sample task');
  });
});
