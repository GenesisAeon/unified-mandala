import { ariaLabel, applyColorBlindMode } from './accessibility';

test('sets aria label', () => {
  const el = document.createElement('div');
  ariaLabel(el, 'demo');
  expect(el.getAttribute('aria-label')).toBe('demo');
});

test('applies color blind class', () => {
  const el = document.createElement('div');
  applyColorBlindMode(el);
  expect(el.classList.contains('color-blind')).toBe(true);
});
