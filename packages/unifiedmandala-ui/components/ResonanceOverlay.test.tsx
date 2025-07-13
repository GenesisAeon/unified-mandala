import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResonanceOverlay from './ResonanceOverlay';

test('activates overlay when resonance high', () => {
  const { getByTestId } = render(<ResonanceOverlay resonance={90} />);
  const el = getByTestId('resonance-overlay');
  expect(el.style.opacity).toBe('1');
});

test('hides overlay when resonance low', () => {
  const { getByTestId } = render(<ResonanceOverlay resonance={50} />);
  const el = getByTestId('resonance-overlay');
  expect(el.style.opacity).toBe('0');
});
