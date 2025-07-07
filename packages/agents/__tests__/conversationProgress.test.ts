import fs from 'fs';
import path from 'path';
import { markProcessed, isProcessed } from '../conversationProgress';
import { describe, it, expect, afterEach } from 'vitest';

const STORE = path.resolve('GenesisAeonZIPMEM/conversation_progress.json');

afterEach(() => {
  if (fs.existsSync(STORE)) fs.unlinkSync(STORE);
});

describe('conversationProgress', () => {
  it('records and checks processed ids', () => {
    markProcessed('frag1');
    expect(isProcessed('frag1')).toBe(true);
    expect(isProcessed('other')).toBe(false);
  });
});
