import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { MetaScoreComposer, MetaScore } from './MetaScoreComposer';

const composer = new MetaScoreComposer();

test('aggregates scores by layer', () => {
  const input: MetaScore[][] = [
    [
      { layer: 'a', score: 0.8 },
      { layer: 'b', score: 0.6 },
    ],
    [
      { layer: 'a', score: 0.6 },
      { layer: 'b', score: 0.9 },
    ],
  ];
  const result = composer.aggregate(input);
  expect(result).toEqual([
    { layer: 'a', score: 0.7 },
    { layer: 'b', score: 0.75 },
  ]);
});

test('detects conflicts', () => {
  const scores: MetaScore[] = [{ layer: 'a', score: 1.2 }];
  expect(composer.detectConflicts(scores)).toBe(true);
});
