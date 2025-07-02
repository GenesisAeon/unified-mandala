export class EventPlaybackModule {
  private events: any[] = [];
  record(event: any) { this.events.push(event); }
  playback() { return [...this.events]; }
}
