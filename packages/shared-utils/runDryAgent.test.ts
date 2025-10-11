import { runDryAgent, AgentConfig } from './runDryAgent';

test('runDryAgent logs success and failure', () => {
  const ok: AgentConfig = { name: 'ok', simulate: () => {} };
  const fail: AgentConfig = {
    name: 'fail',
    simulate: () => {
      throw new Error('err');
    },
  };
  expect(runDryAgent(ok)).toEqual(['Agent ok passed dry-check.']);
  expect(runDryAgent(fail)[0]).toMatch('fail');
});
