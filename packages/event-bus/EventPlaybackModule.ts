export interface RecordedEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

export class EventPlaybackModule {
  private events: RecordedEvent[] = [];

  record(event: Omit<RecordedEvent, 'timestamp'>): void {
    this.events.push({ ...event, timestamp: Date.now() });
  }

  playback(type?: string): RecordedEvent[] {
    return this.events
      .filter(e => !type || e.type === type)
      .map(e => ({ ...e }));
  }

  clear(): void {
    this.events = [];
  }
}
