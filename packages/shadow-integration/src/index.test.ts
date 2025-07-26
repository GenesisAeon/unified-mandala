import { init } from './index';

test('init returns status', () => {
  expect(init()).toBe('shadow-integration ready');
});
