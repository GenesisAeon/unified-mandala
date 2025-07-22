import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HaikuOverlay from './HaikuOverlay';

jest.useFakeTimers();

test('renders a haiku overlay', () => {
  render(<HaikuOverlay />);
  jest.runOnlyPendingTimers();
  expect(screen.getByLabelText('Haiku Overlay')).toBeInTheDocument();
});

jest.useRealTimers();
