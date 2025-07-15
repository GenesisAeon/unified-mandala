import { classifyComponent } from './system_component_classification';

test('classifies mental component', () => {
  expect(classifyComponent({ origin: 'bio', domain: 'mental process' })).toBe('mental');
});

test('classifies natural component', () => {
  expect(classifyComponent({ origin: 'biological', domain: 'physical' })).toBe('natuerlich');
});

test('classifies synthetic component', () => {
  expect(classifyComponent({ origin: 'artificial', domain: 'physical' })).toBe('synthetisch');
});
