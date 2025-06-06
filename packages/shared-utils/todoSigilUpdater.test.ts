import fs from 'fs';
import path from 'path';
import { updateTodoSigilStatus } from './todoSigilUpdater';

const yaml = `sigillin_id: test\naufgaben:\n  - id: t1\n    beschreibung: test\n    status: offen\n`;
const file = path.join(__dirname, 'todo-temp.yaml');

beforeEach(() => {
  fs.writeFileSync(file, yaml, 'utf8');
});

afterEach(() => {
  fs.unlinkSync(file);
});

test('updates status when check passes', async () => {
  const checks = { t1: () => true };
  await updateTodoSigilStatus(file, checks);
  const out = fs.readFileSync(file, 'utf8');
  expect(out).toContain('status: erledigt');
});
