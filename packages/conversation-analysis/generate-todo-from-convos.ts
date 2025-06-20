import fs from 'fs';
import yaml from 'yaml';

export interface TodoItem {
  id: string;
  beschreibung: string;
  status: string;
}

export function generateTodos(input = 'docs/sigils/conversations.json', output = 'todo-sigil.yaml') {
  const raw = fs.readFileSync(input, 'utf-8');
  const data = JSON.parse(raw);
  const todos: TodoItem[] = [];
  (Array.isArray(data) ? data : []).forEach((item: any) => {
    const text: string = item.text || '';
    if (/wir sollten|TODO/i.test(text)) {
      todos.push({ id: `todo-${todos.length + 1}`, beschreibung: text.trim(), status: 'offen' });
    }
  });
  fs.writeFileSync(output, yaml.stringify(todos));
}

if (require.main === module) {
  generateTodos(process.argv[2], process.argv[3]);
}
