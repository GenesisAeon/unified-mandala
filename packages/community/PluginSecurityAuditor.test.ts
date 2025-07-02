import { auditPlugin } from './PluginSecurityAuditor';

test('flags dangerous code', () => {
  expect(auditPlugin({ code: 'dangerous op' })).toBe(false);
  expect(auditPlugin({ code: 'safe' })).toBe(true);
});
