import { CREPContext } from './CREPContext';
import { CREPEntry } from './types';

test('dispatch adds entry and emits update', () => {
  const ctx = new CREPContext();
  const entry: CREPEntry = { timestamp: new Date(), C: 1, R: 1, E: 1, P: 1 };
  let called = false;
  ctx.on('update', (state) => {
    called = true;
    expect(state.history[0]).toEqual(entry);
  });
  ctx.dispatch({ type: 'ADD', entry });
  expect(called).toBe(true);
  expect(ctx.getState().history).toHaveLength(1);
});

test('reset clears history', () => {
  const ctx = new CREPContext({ history: [{ timestamp: new Date(), C: 1, R: 1, E: 1, P: 1 }] });
  ctx.dispatch({ type: 'RESET' });
  expect(ctx.getState().history).toHaveLength(0);
});
