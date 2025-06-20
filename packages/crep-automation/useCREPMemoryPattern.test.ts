import fs from 'fs';
import path from 'path';
import { renderHook } from '@testing-library/react';
import { AeonMemory } from '../core/AeonMemory';
import { useCREPMemoryPattern } from './useCREPMemoryPattern';

const CHRONIK = path.resolve('mandala-chronik.yaml');

describe('useCREPMemoryPattern', () => {
  beforeEach(() => {
    if (fs.existsSync(CHRONIK)) fs.unlinkSync(CHRONIK);
    AeonMemory.record('alpha');
    AeonMemory.record('beta');
  });

  it('returns joined memory entries', () => {
    const { result } = renderHook(() => useCREPMemoryPattern(2));
    expect(result.current).toContain('alpha');
    expect(result.current).toContain('beta');
  });
});
