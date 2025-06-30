import chokidar from 'chokidar';

export function watchConversations(dir: string, onNew: () => void) {
  const watcher = chokidar.watch(`${dir}/*.json`, { ignoreInitial: true });
  watcher.on('add', () => {
    onNew();
  });
  return watcher;
}
