import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConversationTodoExtractor } from './ConversationTodoExtractor';

describe('ConversationTodoExtractor', () => {
  it('extracts todo lines', () => {
    const extractor = new ConversationTodoExtractor();
    const logs = ['some text', 'TODO: implement feature', 'irrelevant', 'Aufgabe - review code'];
    expect(extractor.extract(logs)).toEqual(['implement feature', 'review code']);
  });
});
