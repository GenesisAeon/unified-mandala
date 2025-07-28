import { MemoryGovernanceService } from './index';
import { MemoryManager } from '../memory-manager';

test('enforceLimit triggers cleanup when limit exceeded', () => {
  const manager = new MemoryManager({ daily: 0, weekly: 0, longterm: 0 });
  manager.add('daily', 'one');
  manager.add('daily', 'two');
  const governance = new MemoryGovernanceService(manager);
  governance.enforceLimit('daily', 1);
  expect(manager.get('daily').length).toBeLessThanOrEqual(1);
});

test('detectTrauma filters negative entries', () => {
  const manager = new MemoryManager({ daily: 0, weekly: 0, longterm: 0 });
  manager.add('daily', 'happy day');
  manager.add('daily', 'deep trauma event');
  const governance = new MemoryGovernanceService(manager);
  const result = governance.detectTrauma('daily');
  expect(result).toEqual(['deep trauma event']);
});

test('clear resets selected category', () => {
  const manager = new MemoryManager({ daily: 0, weekly: 0, longterm: 0 });
  manager.add('daily', 'one');
  manager.add('weekly', 'two');
  const governance = new MemoryGovernanceService(manager);
  governance.clear('daily');
  expect(manager.get('daily')).toEqual([]);
  expect(manager.get('weekly')).toEqual(['two']);
});

test('listCategories returns manager categories', () => {
  const manager = new MemoryManager({ daily: 0, weekly: 0, longterm: 0 });
  const governance = new MemoryGovernanceService(manager);
  expect(governance.listCategories().sort()).toEqual(['daily', 'longterm', 'weekly']);
});
