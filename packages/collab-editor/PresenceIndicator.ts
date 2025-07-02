export class PresenceIndicator {
  private users = new Set<string>();
  join(user: string) { this.users.add(user); }
  leave(user: string) { this.users.delete(user); }
  count() { return this.users.size; }
}
