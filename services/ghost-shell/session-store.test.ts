import { addSession, getSession, removeSession } from './session-store';

describe('session store', () => {
  it('tracks sessions and history', () => {
    addSession('1');
    const session = getSession('1');
    expect(session).toBeDefined();
    if (session) {
      session.history.push('hello');
    }
    expect(getSession('1')?.history).toEqual(['hello']);
    removeSession('1');
    expect(getSession('1')).toBeUndefined();
  });
});
