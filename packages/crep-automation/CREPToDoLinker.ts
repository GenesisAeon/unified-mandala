export interface CREPChange { R: number; E: number }

export function linkCREPToDos(change: CREPChange): string[] {
  const tasks: string[] = [];
  if (change.E > 0) tasks.push('Dokumentation aktualisieren');
  if (change.R < 0) tasks.push('Diskussion anstoßen');
  return tasks;
}
