import path from 'path';
import fs from 'fs';
import { extractImplicitTodosFromConversations } from '../packages/shared-utils/conversationAnalyzer';
import { createTodoSigil } from '../packages/shared-utils/todoSigilGenerator';

export function synthFromSymbolflow(sourcePath: string, outPath: string) {
  const todos = extractImplicitTodosFromConversations(path.resolve(sourcePath));
  const items = todos.map((t) => ({ text: t, done: false }));
  const yaml = createTodoSigil(items, {
    id: 'aeon:poetic-todo',
    titel: 'Poetische Aufgaben',
    symbolzeit: 'tag',
  });
  fs.writeFileSync(outPath, yaml);
  console.log(`Poetic todo sigil written to ${outPath}`);
}

if (require.main === module) {
  const src = process.argv[2] || path.join(__dirname, '../docs/sigils/advancedconversations.json');
  const out = process.argv[3] || path.join(__dirname, '../docs/sigils/poetic-todo.yaml');
  synthFromSymbolflow(src, out);
}
