export class PantheonLobbyService {
  private sessions = new Set<string>();

  join(id: string) {
    this.sessions.add(id);
  }

  leave(id: string) {
    this.sessions.delete(id);
  }

  has(id: string): boolean {
    return this.sessions.has(id);
  }
}
