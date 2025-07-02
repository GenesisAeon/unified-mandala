import { RealTimeCollaborationChat } from './RealTimeCollaborationChat';

test('emits message event', () => {
  const chat = new RealTimeCollaborationChat();
  const data: any[] = [];
  chat.on('message', m => data.push(m));
  chat.send('u', 'hi');
  expect(data[0]).toEqual({ user: 'u', msg: 'hi' });
});
