import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { AeonJsTranspilerAgent } from './AeonJsTranspilerAgent';

describe('AeonJsTranspilerAgent', () => {
  const output = 'tmp-aeon.js';

  afterEach(() => {
    if (fs.existsSync(output)) fs.unlinkSync(output);
  });

  it('transpiles aeon source to JS file', async () => {
    const agent = new AeonJsTranspilerAgent(output);
    const task = { id: '1', description: 'TASK Demo' } as any;
    await agent.handle(task);
    const content = fs.readFileSync(path.resolve(output), 'utf-8');
    expect(content).toContain('aeonTasks');
    expect(content).toContain('Demo');
  });
});
