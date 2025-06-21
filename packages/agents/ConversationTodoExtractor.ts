export class ConversationTodoExtractor {
  constructor(private keywords: string[] = ['TODO', 'Aufgabe']) {}

  extract(logs: string[]): string[] {
    const tasks: string[] = [];
    const pattern = new RegExp(`(?:${this.keywords.join('|')})[:\-]?\s*(.+)`, 'i');
    for (const line of logs) {
      const match = line.match(pattern);
      if (match) {
        const cleaned = match[1].trim().replace(/^[-\s]+/, '');
        tasks.push(cleaned);
      }
    }
    return tasks;
  }
}
