export interface Channel {
  name: string;
  length: number;
}

export function channelLatency(channel: Channel): number {
  const velocity = 1; // normalized units per second
  return channel.length / velocity;
}
