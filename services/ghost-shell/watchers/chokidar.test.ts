import chokidar from 'chokidar';
import { watchFragments } from './chokidar';
import { runSelfLearn } from '../../../scripts/self-learn';

jest.mock('chokidar');
jest.mock('../../../scripts/self-learn');

describe('fragment watcher', () => {
  it('triggers runSelfLearn on new file', () => {
    const onMock = jest.fn();
    (chokidar.watch as any as jest.Mock).mockReturnValue({ on: onMock });

    watchFragments('test/*.json');

    expect(chokidar.watch).toHaveBeenCalledWith('test/*.json', { ignoreInitial: true });
    const handler = onMock.mock.calls[0][1];
    handler('new.json');
    expect(runSelfLearn).toHaveBeenCalled();
  });
});
