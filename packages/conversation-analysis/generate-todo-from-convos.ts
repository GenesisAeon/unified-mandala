import fs from 'fs';
import yaml from 'yaml';

export interface TodoItem {
  id: string;
  beschreibung: string;
  status: string;
  /** CREP based priority, higher means more relevant */
  priority: number;
}
export function generateTodos(inputs: string[] = ['docs/sigils/newadvancedconversations.json'], output = 'todo-sigil.yaml') {
  const todos: TodoItem[] = [];
  for (const file of inputs) {
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf-8');
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      continue;
    }
    (Array.isArray(data) ? data : []).forEach((item: any) => {
      const mapping = item.mapping ? Object.values(item.mapping) : [];
      for (const node of mapping as any[]) {
        const msg = (node as any).message;
        if (!msg) continue;
        const content = msg.content;
        const parts = Array.isArray(content?.parts) ? content.parts : typeof content === 'string' ? [content] : [];
        for (const part of parts) {
          if (typeof part !== 'string') continue;
          if (/wir sollten|könnten wir|TODO/i.test(part)) {
            const m = part.match(/CREP[:\s]*([0-9.]+)/i);
            const priority = m ? parseFloat(m[1]) : 0;
            todos.push({
              id: `todo-${todos.length + 1}`,
              beschreibung: part.trim(),
              status: 'offen',
              priority,
            });
          }
        }
      }
    });
  }
  todos.sort((a, b) => b.priority - a.priority);
  fs.writeFileSync(output, yaml.stringify(todos));
}

if (require.main === module) {
  generateTodos(process.argv[2], process.argv[3]);
}
