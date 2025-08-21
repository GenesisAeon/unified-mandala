import { ExperimentModule, analyze } from '../index';
import { test, expect } from 'vitest';

test('placeholder modules execute', () => {
  const exp = new ExperimentModule();
  expect(exp.run()).toBe('experiment placeholder');
  expect(analyze(null)).toBe('analysis placeholder');
});
