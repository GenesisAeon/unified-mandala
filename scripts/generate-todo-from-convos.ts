import path from 'path';
import fs from 'fs';
import { extractImplicitTodosFromConversations } from '../packages/shared-utils/conversationAnalyzer';
import { createTodoSigil } from '../packages/shared-utils/todoSigilGenerator';

export function generateTodoFromConvos(
  sourcePath = path.join(__dirname, '../docs/sigils/advancedconversations.json'),
  outPath = path.join(__dirname, '../docs/sigils/todo-from-convos.yaml'),
) {
  const tasks = extractImplicitTodosFromConversations(path.resolve(sourcePath)).map((t) => ({
    text: t,
    done: false,
  }));
  const yaml = createTodoSigil(tasks, {
    id: 'aeon:todo-from-convos',
    titel: 'Konversations ToDos',
    symbolzeit: 'tag',
  });
  fs.writeFileSync(outPath, yaml);
  console.log(`todo-from-convos.yaml generated from ${path.basename(sourcePath)}`);
}

if (require.main === module) {
  const src = process.argv[2];
  generateTodoFromConvos(src);
}
