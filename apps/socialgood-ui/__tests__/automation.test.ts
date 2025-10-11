import {
  prioritizeTodos,
  generateDocumentation,
  generateSigil,
  analyzeConversations,
} from '../automation';

describe('automation helpers', () => {
  test('prioritizeTodos sorts by priority descending', () => {
    const todos = [
      { task: 'b', priority: 1 },
      { task: 'a', priority: 5 },
    ];
    const [first] = prioritizeTodos(todos);
    expect(first.task).toBe('a');
  });

  test('generateDocumentation turns tasks into markdown', () => {
    const doc = generateDocumentation(['alpha', 'beta']);
    expect(doc).toBe('- alpha\n- beta');
  });

  test('generateSigil creates simple sigil', () => {
    const sigil = generateSigil('hello world');
    expect(sigil).toBe('H-E-L-L');
  });

  test('analyzeConversations returns stats', () => {
    const stats = analyzeConversations(['hello world', 'hi']);
    expect(stats.count).toBe(2);
    expect(stats.averageLength).toBeCloseTo(1.5, 5);
  });
});
