export interface ChannelEntry {
  channel: string;
  message: string;
  timestamp: number;
}

/**
 * ChannelScribe records messages per channel with timestamps.
 * It can return logs for a specific channel or all channels and
 * allows clearing logs.
 */
export class ChannelScribe {
  private log: ChannelEntry[] = [];

  record(channel: string, message: string): void {
    this.log.push({ channel, message, timestamp: Date.now() });
  }

  getLog(channel?: string): ChannelEntry[] {
    return channel ? this.log.filter((e) => e.channel === channel) : [...this.log];
  }

  clear(channel?: string): void {
    if (channel) {
      this.log = this.log.filter((e) => e.channel !== channel);
    } else {
      this.log = [];
    }
  }
}
