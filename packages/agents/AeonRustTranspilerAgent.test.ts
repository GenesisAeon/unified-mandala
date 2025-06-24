import fs from 'fs';
import path from 'path';
import { AeonRustTranspilerAgent } from './AeonRustTranspilerAgent';

describe('AeonRustTranspilerAgent', () => {
  const output = 'tmp-aeon.rs';

  afterEach(() => {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  });

  it('transpiles aeon source to Rust file', async () => {
    const agent = new AeonRustTranspilerAgent(output);
    const task = { id: '1', description: 'TASK Demo' } as any;
    await agent.handle(task);
    const content = fs.readFileSync(path.resolve(output), 'utf-8');
    expect(content).toContain('AEON_TASKS');
    expect(content).toContain('Demo');
  });
});
