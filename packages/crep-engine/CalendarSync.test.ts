import { exportToCalendar } from './CalendarSync';
import { PrioritizedTodo } from './TodoPriority';

describe('exportToCalendar', () => {
  it('exports only high priority todos', () => {
    const todos: PrioritizedTodo[] = [
      { text: 'a', priority: 'high' },
      { text: 'b', priority: 'low' }
    ];
    expect(exportToCalendar(todos)).toEqual(['Event: a']);
  });
});
