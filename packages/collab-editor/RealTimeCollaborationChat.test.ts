import { RealTimeCollaborationChat } from './RealTimeCollaborationChat';

test('emits message event', () => {
  const chat = new RealTimeCollaborationChat();
  const data: any[] = [];
  chat.on('message', (m) => data.push(m));
  chat.send('u', 'hi');
  expect(data[0].user).toBe('u');
  expect(data[0].msg).toBe('hi');
  expect(typeof data[0].ts).toBe('number');
});

test('records history and join/leave events', () => {
  const chat = new RealTimeCollaborationChat();
  const events: any[] = [];
  chat.on('join', (u) => events.push(['join', u]));
  chat.on('leave', (u) => events.push(['leave', u]));
  chat.on('message', (m) => events.push(['msg', m.user]));

  chat.join('alice');
  chat.send('alice', 'hello');
  chat.leave('alice');

  expect(chat.getHistory().length).toBe(1);
  expect(events[0]).toEqual(['join', 'alice']);
  expect(events[1]).toEqual(['msg', 'alice']);
  expect(events[2]).toEqual(['leave', 'alice']);
});
