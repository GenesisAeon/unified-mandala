export interface Todo {
  task: string;
  priority: number;
}

export function prioritizeTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => b.priority - a.priority);
}

export function generateDocumentation(tasks: string[]): string {
  return tasks.map((t) => `- ${t}`).join('\n');
}

export function generateSigil(seed: string): string {
  const compact = seed.replace(/\s+/g, '').toUpperCase();
  return compact.slice(0, 4).split('').join('-');
}

export interface ConversationStats {
  count: number;
  averageLength: number;
}

export function analyzeConversations(conversations: string[]): ConversationStats {
  const count = conversations.length;
  const totalWords = conversations.reduce(
    (sum, c) => sum + c.split(/\s+/).filter(Boolean).length,
    0
  );
  const averageLength = count === 0 ? 0 : totalWords / count;
  return { count, averageLength };
}

