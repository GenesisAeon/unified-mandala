import { describe, it, expect } from 'vitest';
import { PantheonFeedbackService } from './PantheonFeedbackService';

describe('PantheonFeedbackService', () => {
  it('prefixes feedback', () => {
    const svc = new PantheonFeedbackService();
    expect(svc.collectFeedback('hi')).toBe('feedback:hi');
  });

  it('gathers feedback from agents', () => {
    const svc = new PantheonFeedbackService();
    expect(svc.gatherFeedback(['a', 'b'])).toEqual(['feedback:a', 'feedback:b']);
  });

  it('coordinates round via callback', () => {
    const svc = new PantheonFeedbackService();
    const result = svc.coordinateRound(['a'], (m) => m.toUpperCase());
    expect(result).toEqual(['FEEDBACK:A']);
  });
});
