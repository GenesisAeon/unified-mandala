describe('ghost-shell cluster', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('forks workers when primary', () => {
    const fork = jest.fn();
    const on = jest.fn();
    jest.isolateModules(() => {
      jest.doMock('cluster', () => ({ isPrimary: true, fork, on }));
      jest.doMock('os', () => ({ cpus: () => [1, 2, 3] }));
      jest.doMock('./server', () => ({ startServer: jest.fn() }));
      jest.doMock('./logger', () => ({ logger: { warn: jest.fn() } }));
      process.env.PORT_BASE = '5000';
      require('./cluster');
      delete process.env.PORT_BASE;
    });
    expect(fork).toHaveBeenCalledTimes(3);
    expect(fork).toHaveBeenNthCalledWith(1, {
      PORT: '5000',
      SECRET: 'ghost-secret',
    });
    expect(fork).toHaveBeenNthCalledWith(2, {
      PORT: '5001',
      SECRET: 'ghost-secret',
    });
    expect(fork).toHaveBeenNthCalledWith(3, {
      PORT: '5002',
      SECRET: 'ghost-secret',
    });
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
