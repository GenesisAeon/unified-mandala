export type TodoPriorityLevel = 'low' | 'medium' | 'high';
export interface PrioritizedTodo { text: string; priority: TodoPriorityLevel; }

export function linkTodosWithCREP(todos: string[], crepScore: number): PrioritizedTodo[] {
  return todos.map(text => {
    let priority: TodoPriorityLevel = 'low';
    if (crepScore > 0.7) priority = 'high';
    else if (crepScore > 0.4) priority = 'medium';
    return { text, priority };
  });
}
