import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface LogOptions {
  conversationsPath?: string;
  todoPath?: string;
  outPath?: string;
  limit?: number;
}

export async function logTriggers(options: LogOptions = {}) {
  const conversationsPath =
    options.conversationsPath || path.resolve('docs/sigils/newadvancedconversations.json');
  const todoPath = options.todoPath || path.resolve('advancedToDo.yaml');
  const outPath = options.outPath || path.resolve('scripts/chat_migration/migration_log.json');
  const limit = options.limit ?? 5;

  // Load conversations and extract latest titles as trigger phrases
  const convRaw = await fs.readFile(conversationsPath, 'utf8');
  let convos: any[] = [];
  try {
    convos = JSON.parse(convRaw);
    if (!Array.isArray(convos)) {
      throw new Error('Expected conversations JSON array');
    }
  } catch (err) {
    throw new Error(`Failed to parse conversations at ${conversationsPath}: ${err}`);
  }
  const triggerPhrases = convos
    .slice(-limit)
    .map((c) => c.title)
    .filter(Boolean);

  // Load advanced ToDos and filter open ones
  const todoRaw = await fs.readFile(todoPath, 'utf8');
  const todos = (yaml.load(todoRaw) as any[]) || [];
  const openTodos = todos
    .filter((t) => t && t.commit && t.status !== 'done')
    .map((t) => t.commit as string);

  const log = { triggerPhrases, openTodos };
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(log, null, 2));
  return log;
}

if (require.main === module) {
  logTriggers().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
