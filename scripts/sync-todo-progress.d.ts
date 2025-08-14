export interface SyncResult {
  progress: any;
  addedDone: number;
  addedPending: number;
}
export function loadTasks(filePath: string): any;
export function syncTodoProgress(
  partsDir: string,
  progressFile: string,
  extraFiles?: string[],
  options?: { dryRun?: boolean }
): SyncResult;
