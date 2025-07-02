import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { AeonKIResonanzAnalyzer } from './AeonKIResonanzAnalyzer';

test('counts resonance messages', () => {
  const analyzer = new AeonKIResonanzAnalyzer();
  const result = analyzer.analyze(['Resonanz steigt', 'kein match', 'resonanz ton']);
  expect(result.resonanceCount).toBe(2);
});
