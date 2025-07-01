export interface Session {
  history: any[];
  lastActive: number;
}

let ttlMs = 60 * 60 * 1000; // 1 hour default
let maxHistory = 50;

const sessions = new Map<string, Session>();

export function configureSessionStore(options: {
  ttlMs?: number;
  maxHistory?: number;
} = {}): void {
  if (options.ttlMs !== undefined) {
    ttlMs = options.ttlMs;
  }
  if (options.maxHistory !== undefined) {
    maxHistory = options.maxHistory;
  }
}

export function addSession(id: string): void {
  sessions.set(id, { history: [], lastActive: Date.now() });
}

export function getSession(id: string): Session | undefined {
  const session = sessions.get(id);
  if (!session) {
    return undefined;
  }
  if (Date.now() - session.lastActive > ttlMs) {
    sessions.delete(id);
    return undefined;
  }
  return session;
}

export function addHistory(id: string, entry: any): void {
  let session = getSession(id);
  if (!session) {
    addSession(id);
    session = sessions.get(id)!;
  }
  session.lastActive = Date.now();
  session.history.push(entry);
  if (session.history.length > maxHistory) {
    session.history = session.history.slice(-maxHistory);
  }
}

export function removeSession(id: string): void {
  sessions.delete(id);
}

export function pruneSessions(): void {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActive > ttlMs) {
      sessions.delete(id);
    } else if (session.history.length > maxHistory) {
      session.history = session.history.slice(-maxHistory);
    }
  }
}
