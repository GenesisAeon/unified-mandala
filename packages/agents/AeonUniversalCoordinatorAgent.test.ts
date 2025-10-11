import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { AeonUniversalCoordinatorAgent } from './AeonUniversalCoordinatorAgent';

describe('AeonUniversalCoordinatorAgent', () => {
  const outputs = [
    'tmp-aeon-all.ts',
    'tmp-aeon-all.py',
    'tmp-aeon-all.go',
    'tmp-aeon-all.rs',
    'tmp-aeon-all.js',
  ];

  afterEach(() => {
    outputs.forEach((o) => {
      if (fs.existsSync(o)) fs.unlinkSync(o);
    });
  });

  it('transpiles aeon source to multiple files', async () => {
    const agent = new AeonUniversalCoordinatorAgent(...outputs);
    const task = { id: '1', description: 'TASK Demo' } as any;
    await agent.handle(task);
    outputs.forEach((o) => {
      const content = fs.readFileSync(path.resolve(o), 'utf-8');
      expect(content).toContain('Demo');
    });
  });
});
