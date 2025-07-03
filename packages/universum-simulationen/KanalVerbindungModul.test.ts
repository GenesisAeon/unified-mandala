import { channelLatency, Channel } from './KanalVerbindungModul';

test('computes latency based on length', () => {
  const ch: Channel = { name: 'vent', length: 5 };
  expect(channelLatency(ch)).toBe(5);
});
