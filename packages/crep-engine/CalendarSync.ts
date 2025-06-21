import { PrioritizedTodo } from './TodoPriority';

export function exportToCalendar(todos: PrioritizedTodo[]): string[] {
  return todos
    .filter(t => t.priority === 'high')
    .map(t => `Event: ${t.text}`);
}
