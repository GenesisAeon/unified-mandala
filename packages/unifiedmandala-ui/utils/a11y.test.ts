import '@testing-library/jest-dom';
import { applyAria, enableColorblindMode, disableColorblindMode } from './a11y';

test('applyAria sets attributes', () => {
  const el = document.createElement('div');
  applyAria(el, 'button', 'demo');
  expect(el.getAttribute('role')).toBe('button');
  expect(el.getAttribute('aria-label')).toBe('demo');
});

test('colorblind mode toggles class', () => {
  enableColorblindMode(document);
  expect(document.body.classList.contains('colorblind-mode')).toBe(true);
  disableColorblindMode(document);
  expect(document.body.classList.contains('colorblind-mode')).toBe(false);
});
