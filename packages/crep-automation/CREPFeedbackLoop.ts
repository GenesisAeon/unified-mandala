import fs from 'fs';

export interface CREPSnapshot {
  R: number;
  E: number;
}

export function generateFeedbackTasks(snapshot: CREPSnapshot): string[] {
  const tasks: string[] = [];
  if (snapshot.E < 0) tasks.push('Team-Check-in');
  if (snapshot.R < 0) tasks.push('Dokumentation aktualisieren');
  return tasks;
}

export function scheduleFeedback(snapshot: CREPSnapshot, file = 'scheduled-tasks.json'): void {
  const tasks = generateFeedbackTasks(snapshot);
  fs.writeFileSync(file, JSON.stringify(tasks, null, 2), 'utf-8');
}
