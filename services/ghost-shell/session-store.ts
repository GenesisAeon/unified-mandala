export interface Session {
  history: any[];
}

const sessions = new Map<string, Session>();

export function addSession(id: string): void {
  sessions.set(id, { history: [] });
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export function removeSession(id: string): void {
  sessions.delete(id);
}
