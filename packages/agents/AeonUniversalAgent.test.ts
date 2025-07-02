import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { AeonUniversalAgent } from './AeonUniversalAgent';
import { AeonMemory } from '../core/AeonMemory';

const CHRONIK = path.resolve('mandala-chronik.yaml');

describe('AeonUniversalAgent', () => {
  beforeEach(() => {
    if (fs.existsSync(CHRONIK)) fs.unlinkSync(CHRONIK);
  });

  it('compiles aeon source and records tasks', async () => {
    const agent = new AeonUniversalAgent();
    const task = { id: '1', description: 'TASK Hallo' } as any;
    await agent.handle(task);
    const content = fs.readFileSync(CHRONIK, 'utf-8');
    expect(content).toContain('Hallo');
    const entries = AeonMemory.all();
    expect(entries[0].description).toBe('Hallo');
  });
});
