import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { AeonPythonTranspilerAgent } from './AeonPythonTranspilerAgent';

describe('AeonPythonTranspilerAgent', () => {
  const output = 'tmp-aeon.py';

  afterEach(() => {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  });

  it('transpiles aeon source to Python file', async () => {
    const agent = new AeonPythonTranspilerAgent(output);
    const task = { id: '1', description: 'TASK Demo' } as any;
    await agent.handle(task);
    const content = fs.readFileSync(path.resolve(output), 'utf-8');
    expect(content).toContain('aeon_tasks');
    expect(content).toContain('Demo');
  });
});
