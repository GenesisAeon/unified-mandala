import { AutomergeFederation } from './AutomergeFederation';

test('local change sets pending status', () => {
  const f = new AutomergeFederation();
  f.applyLocalChange('hi');
  expect(f.getStatus().pending).toBe(true);
});

test('mergeRemoteChange clears pending and updates doc', () => {
  const f = new AutomergeFederation();
  f.applyLocalChange('hi');
  const before = Date.now();
  f.mergeRemoteChange('remote');
  expect(f.getDocument()).toBe('remote');
  expect(f.getStatus().pending).toBe(false);
  expect(f.getStatus().lastSync).toBeGreaterThanOrEqual(before);
});
