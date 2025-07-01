import {
  addSession,
  addHistory,
  configureSessionStore,
  getSession,
  pruneSessions,
  removeSession,
} from './session-store';

jest.useFakeTimers();

describe('session store', () => {
  beforeEach(() => {
    configureSessionStore({ ttlMs: 1000, maxHistory: 2 });
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
});
