import fs from 'fs';

let addSession: any;
let addHistory: any;
let configureSessionStore: any;
let getSession: any;
let pruneSessions: any;
let removeSession: any;
let stopSessionPersistence: any;

jest.useFakeTimers();

describe('session store', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.isolateModules(() => {
      const mod = require('./session-store');
      addSession = mod.addSession;
      addHistory = mod.addHistory;
      configureSessionStore = mod.configureSessionStore;
      getSession = mod.getSession;
      pruneSessions = mod.pruneSessions;
      removeSession = mod.removeSession;
      stopSessionPersistence = mod.stopSessionPersistence;
    });
    configureSessionStore({ ttlMs: 1000, maxHistory: 2 });
    if (fs.existsSync('services/ghost-shell/sessions.json')) {
      fs.unlinkSync('services/ghost-shell/sessions.json');
    }
  });

  afterEach(() => {
    stopSessionPersistence();
    if (fs.existsSync('services/ghost-shell/sessions.json')) {
      fs.unlinkSync('services/ghost-shell/sessions.json');
    }
  });

  it('tracks sessions and prunes history', () => {
    addSession('1');
    addHistory('1', 'a');
    addHistory('1', 'b');
    addHistory('1', 'c');
    expect(getSession('1')?.history).toEqual(['b', 'c']);
    removeSession('1');
  });

  it('expires sessions after ttl', () => {
    addSession('2');
    jest.advanceTimersByTime(1500);
    pruneSessions();
    expect(getSession('2')).toBeUndefined();
  });

  it('persists sessions to disk', () => {
    addSession('persist');
    jest.advanceTimersByTime(31000);
    const data = JSON.parse(
      fs.readFileSync('services/ghost-shell/sessions.json', 'utf8')
    );
    expect(data.persist).toBeDefined();
  });

  it('loads sessions from disk on startup', () => {
    fs.writeFileSync(
      'services/ghost-shell/sessions.json',
      JSON.stringify({ loadme: { history: [], lastActive: Date.now() } })
    );
    jest.isolateModules(() => {
      const mod = require('./session-store');
      expect(mod.getSession('loadme')).toBeDefined();
      mod.stopSessionPersistence();
    });
  });
});
