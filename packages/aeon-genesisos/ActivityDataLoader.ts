import { dispatchCmd } from '../cli-tools/dispatchCmd';

export interface ActivityEntry {
  id: string;
  action: string;
}

export async function loadActivity(): Promise<ActivityEntry[]> {
  const status = await dispatchCmd('activity');
  if (status === 200) {
    // placeholder for future REST fetch
    return [{ id: 'demo', action: 'init' }];
  }
  return [];
}
