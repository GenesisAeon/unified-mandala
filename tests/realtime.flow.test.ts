/* @jest-environment node */
import WebSocket from 'ws';
import { AddressInfo } from 'net';
import { LocalEventBus, Subjects } from '../packages/event-bus';
import { ResearchHubWS } from '../packages/realtime/ResearchHubWS';
import { wrap } from '../packages/realtime/StreamProtocol';

test('realtime hub streams token chunks', async () => {
  const bus = new LocalEventBus();
  const server = new ResearchHubWS({ port: 0, bus });
  const addr = server.address() as AddressInfo;
  const ws = new WebSocket(`ws://localhost:${addr.port}`);
  const received: string[] = [];

  await new Promise<void>((resolve) => {
    ws.on('open', () => {
      ws.send(JSON.stringify(wrap({ type: 'subscribe', channel: Subjects.LIVE_ANSWER })));
      ['one', 'two', 'three'].forEach((token, i) =>
        setTimeout(() => bus.publish(Subjects.LIVE_ANSWER, token), 10 + i * 10),
      );
    });

    ws.on('message', (raw) => {
      const env = JSON.parse(raw.toString());
      if (env.msg.type === 'event') {
        received.push(env.msg.payload as string);
        if (received.length === 3) resolve();
      }
    });
  });

  expect(received).toEqual(['one', 'two', 'three']);
  ws.close();
  server.close();
  bus.close();
}, 10000);
