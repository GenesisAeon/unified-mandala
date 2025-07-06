import fs from 'fs';
import path from 'path';

test('organize writes conversations to directories', () => {
  const src = path.join(__dirname, '__src.json');
  const dest = path.join(__dirname, '__zip');
  fs.writeFileSync(src, JSON.stringify([{ title: 'Test', id: '1', mapping: {} }]));
  process.env.ZIP_SRC = src;
  process.env.ZIP_DEST = dest;
  const { organize } = require('../organize-zipmem');
  organize();
  const exists = fs.existsSync(path.join(dest, 'Test', 'conversation.json'));
  expect(exists).toBe(true);
  fs.rmSync(src, { force: true });
  fs.rmSync(dest, { recursive: true, force: true });
  delete process.env.ZIP_SRC;
  delete process.env.ZIP_DEST;
});

test('organize writes conversations to directories', () => {
  const src = path.join(__dirname, '__src.json');
  const dest = path.join(__dirname, '__zip');
  fs.writeFileSync(src, JSON.stringify([{ title: 'Test', id: '1', mapping: {} }]));
  process.env.ZIP_SRC = src;
  process.env.ZIP_DEST = dest;
  const { organize } = require('../organize-zipmem');
  organize();
  const exists = fs.existsSync(path.join(dest, 'Test', 'conversation.json'));
  expect(exists).toBe(true);
  fs.rmSync(src, { force: true });
  fs.rmSync(dest, { recursive: true, force: true });
  delete process.env.ZIP_SRC;
  delete process.env.ZIP_DEST;
});
