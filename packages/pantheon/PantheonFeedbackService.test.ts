import { describe, it, expect } from 'vitest';
import { PantheonFeedbackService } from './PantheonFeedbackService';

describe('PantheonFeedbackService', () => {
  it('prefixes feedback', () => {
    const svc = new PantheonFeedbackService();
    expect(svc.collectFeedback('hi')).toBe('feedback:hi');
  });
});
