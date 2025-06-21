export interface CREPTrend { E: number; }
export interface TodoItem { text: string; }
export interface PrioritizedItem extends TodoItem { priority: 'high' | 'low'; }

export function prioritizeTodos(todos: TodoItem[], trend: CREPTrend): PrioritizedItem[] {
  return todos.map(t => ({
    text: t.text,
    priority: trend.E > 0 ? 'high' : 'low'
  }));
}
