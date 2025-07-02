import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdaptiveUILayout from './AdaptiveUILayout';

function resize(width: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

test('renders mobile layout below threshold', () => {
  resize(400);
  render(<AdaptiveUILayout mobile={<div>m</div>} desktop={<div>d</div>} threshold={500} />);
  expect(screen.getByText('m')).toBeInTheDocument();
});

test('renders desktop layout above threshold', () => {
  resize(600);
  render(<AdaptiveUILayout mobile={<div>m</div>} desktop={<div>d</div>} threshold={500} />);
  expect(screen.getByText('d')).toBeInTheDocument();
});
