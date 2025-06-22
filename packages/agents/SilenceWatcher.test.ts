import { silenceWatcher } from './silenceWatcher';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

test('emits orakel message on silence', () => {
  jest.useFakeTimers();
  const spy = jest.fn();
  GPTEventHub.on('orakel:says', spy);
  silenceWatcher(1000);
  jest.advanceTimersByTime(1500);
  expect(spy).toHaveBeenCalled();
  jest.useRealTimers();
  GPTEventHub.off('orakel:says', spy);
});
