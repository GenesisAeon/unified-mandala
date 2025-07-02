import chokidar from 'chokidar';
import { runSelfLearn } from '../../../scripts/self-learn';
import { logger } from '../logger';

export function watchFragments(pattern = 'newadvancedconversations/*.json') {
  const watcher = chokidar.watch(pattern, { ignoreInitial: true });
  watcher.on('add', async () => {
    try {
      await runSelfLearn();
    } catch (err) {
      logger.error(err);
    }
  });
  return watcher;
}
