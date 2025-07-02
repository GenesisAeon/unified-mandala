export interface Session {
  history: any[];
  lastActive: number;
}

let ttlMs = 60 * 60 * 1000; // 1 hour default
let maxHistory = 50;

import fs from 'fs';
import path from 'path';

const SESSIONS_FILE = path.join(__dirname, 'sessions.json');

const sessions = new Map<string, Session>();

function loadSessions() {
  if (fs.existsSync(SESSIONS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8')) as Record<string, Session>;
      for (const [id, session] of Object.entries(data)) {
        sessions.set(id, session);
      }
    } catch {
      // ignore corrupted files
    }
  }
}

function saveSessions() {
  const obj: Record<string, Session> = {};
  for (const [id, session] of sessions.entries()) {
    obj[id] = session;
  }
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(obj));
}

let persistenceTimer: NodeJS.Timeout | null = null;

export function startSessionPersistence(intervalMs = 30000) {
  if (persistenceTimer) return;
  persistenceTimer = setInterval(saveSessions, intervalMs);
}

export function stopSessionPersistence() {
  if (persistenceTimer) {
    clearInterval(persistenceTimer);
    persistenceTimer = null;
  }
}

loadSessions();
startSessionPersistence();

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
