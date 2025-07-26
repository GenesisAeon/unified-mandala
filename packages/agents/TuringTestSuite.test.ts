import { runTuringTest } from './TuringTestSuite';

test('returns true when response hides identity', async () => {
  const res = await runTuringTest(async () => 'I am doing well.');
  expect(res).toBe(true);
});

test('returns false when response reveals bot', async () => {
  const res = await runTuringTest(async () => 'I am a bot');
  expect(res).toBe(false);
});
