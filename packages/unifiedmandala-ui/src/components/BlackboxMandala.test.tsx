import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlackboxMandala from './BlackboxMandala';

test('dispatches export event', () => {
  const handler = jest.fn();
  window.addEventListener('mandala:export', handler);
  render(<BlackboxMandala />);
  fireEvent.click(screen.getByText('Export'));
  expect(handler).toHaveBeenCalled();
  window.removeEventListener('mandala:export', handler);
});
