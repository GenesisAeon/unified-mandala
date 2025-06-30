import cluster from 'cluster';
import os from 'os';

jest.mock('./server', () => ({ startServer: jest.fn() }));

jest.mock('cluster');
jest.mock('os');

describe('ghost-shell cluster', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('forks workers when primary', () => {
    (cluster as any).isPrimary = true;
    const forkMock = jest.fn();
    const onMock = jest.fn();
    (cluster as any).fork = forkMock;
    (cluster as any).on = onMock;
    (os.cpus as jest.Mock).mockReturnValue([{}, {}]);

    jest.isolateModules(() => {
      require('./cluster');
    });

    expect(forkMock).toHaveBeenCalledTimes(2);
  });

  it('starts server when worker', () => {
    (cluster as any).isPrimary = false;
    const startServerMock = require('./server').startServer as jest.Mock;
    jest.isolateModules(() => {
      require('./cluster');
    });
    expect(startServerMock).toHaveBeenCalled();
  });
});
