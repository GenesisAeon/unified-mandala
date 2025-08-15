import { adaptStyle } from '../style_adapter';

test('informal style appends friendly marker', () => {
  expect(adaptStyle('Hello', { style: 'informal' })).toBe('Hello :)');
});

test('formal style replaces contractions', () => {
  expect(adaptStyle("I can't go", { style: 'formal' })).toBe('I cannot go');
});

test('language adaptation to German', () => {
  expect(adaptStyle('Hello world', { language: 'de' })).toBe('Hallo Welt');
});
