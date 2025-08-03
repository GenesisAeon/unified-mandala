import fs from 'fs';
import path from 'path';
import { CodexMemoryKernel } from './codex-memory-kernel';

test('persists and loads memory entries', () => {
  const temp = path.join(__dirname, 'tmp-memory.json');
  try {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
    const kernel1 = new CodexMemoryKernel(temp);
    kernel1.add('daily', 'hello');
    kernel1.stop();
    expect(fs.existsSync(temp)).toBe(true);
    const kernel2 = new CodexMemoryKernel(temp);
    expect(kernel2.get('daily')).toContain('hello');
    kernel2.stop();
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
  }
});
