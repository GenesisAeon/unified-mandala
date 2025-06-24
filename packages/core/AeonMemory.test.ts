import fs from 'fs';
import path from 'path';
import { renderHook, act } from '@testing-library/react';
import { AeonMemory, useAeonMemory } from './AeonMemory';

const CHRONIK = path.resolve('mandala-chronik.yaml');

describe('AeonMemory', () => {
  beforeEach(() => {
    if (fs.existsSync(CHRONIK)) fs.unlinkSync(CHRONIK);
  });

  it('records tasks to yaml file', () => {
    const entry = AeonMemory.record('test-task', { energy: 1.2, depth: 1, tone: 'mid' });
    expect(fs.existsSync(CHRONIK)).toBe(true);
    const content = fs.readFileSync(CHRONIK, 'utf-8');
    expect(content).toContain('test-task');
    expect(entry.description).toBe('test-task');
    expect(entry.energy).toBe(1.2);
  });

  it('useAeonMemory hook adds entry', () => {
    const { result } = renderHook(() => useAeonMemory());
    act(() => {
      result.current.remember('hook-task');
    });
    expect(result.current.entries[0].description).toBe('hook-task');
  });
});
