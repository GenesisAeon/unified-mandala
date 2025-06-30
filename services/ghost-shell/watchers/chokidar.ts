import chokidar from 'chokidar';
import { runSelfLearn } from '../../../scripts/self-learn';

export function watchFragments(pattern = 'newadvancedconversations/*.json') {
  const watcher = chokidar.watch(pattern, { ignoreInitial: true });
  watcher.on('add', () => {
    runSelfLearn();
  });
  return watcher;
}
