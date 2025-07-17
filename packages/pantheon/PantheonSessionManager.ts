export class PantheonSessionManager {
  private sessions = new Map<string, number>();
  startSession(id: string) {
    this.sessions.set(id, Date.now());
  }
  endSession(id: string) {
    this.sessions.delete(id);
  }
  getActiveSessions() {
    return Array.from(this.sessions.keys());
  }
}
