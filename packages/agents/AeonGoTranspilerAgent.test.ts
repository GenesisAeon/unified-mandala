import fs from 'fs';
import path from 'path';
import { AeonGoTranspilerAgent } from './AeonGoTranspilerAgent';

describe('AeonGoTranspilerAgent', () => {
  const output = 'tmp-aeon.go';

  afterEach(() => {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  });

  it('transpiles aeon source to Go file', async () => {
    const agent = new AeonGoTranspilerAgent(output);
    const task = { id: '1', description: 'TASK Demo' } as any;
    await agent.handle(task);
    const content = fs.readFileSync(path.resolve(output), 'utf-8');
    expect(content).toContain('package aeon');
    expect(content).toContain('Demo');
  });
});
