export class PantheonPortalAnalytics {
  private visits = 0;
  private events: Record<string, number> = {};

  recordVisit() {
    this.visits += 1;
  }

  recordEvent(name: string) {
    this.events[name] = (this.events[name] || 0) + 1;
  }

  getStats() {
    return { visits: this.visits, events: { ...this.events } };
  }
}
