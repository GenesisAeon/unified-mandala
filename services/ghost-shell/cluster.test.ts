describe('ghost-shell cluster', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('forks workers when primary', () => {
    const fork = jest.fn();
    const on = jest.fn();
    jest.isolateModules(() => {
      jest.doMock('cluster', () => ({ isPrimary: true, fork, on }));
      jest.doMock('os', () => ({ cpus: () => [1, 2] }));
      jest.doMock('./server', () => ({ startServer: jest.fn() }));
      jest.doMock('./logger', () => ({ logger: { warn: jest.fn() } }));
      require('./cluster');
    });
    expect(fork).toHaveBeenCalledTimes(2);
    expect(on).toHaveBeenCalledWith('exit', expect.any(Function));
  });

  it('starts server when worker', () => {
    const startServer = jest.fn();
    jest.isolateModules(() => {
      jest.doMock('cluster', () => ({ isPrimary: false }));
      jest.doMock('os', () => ({ cpus: jest.fn() }));
      jest.doMock('./server', () => ({ startServer }));
      jest.doMock('./logger', () => ({ logger: { warn: jest.fn() } }));
      process.env.PORT = '4000';
      process.env.SECRET = 'test';
      require('./cluster');
    });
    expect(startServer).toHaveBeenCalledWith(4000, 'test');
  });
});
