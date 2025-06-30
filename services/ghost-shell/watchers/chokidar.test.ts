/* @jest-environment node */
import { watchConversations } from './chokidar';

test('runs callback on add event', done => {
  const watcher = watchConversations('/tmp', () => {
    watcher.close();
    done();
  });
  (watcher as any).emit('add', '/tmp/test.json');
});
