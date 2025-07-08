import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SigilAlert from './SigilAlert';

test('shows message and handles close', () => {
  const onClose = jest.fn();
  render(<SigilAlert message="alert" onClose={onClose} />);
  expect(screen.getByRole('alert')).toHaveTextContent('alert');
  fireEvent.click(screen.getByLabelText('close'));
  expect(onClose).toHaveBeenCalled();
});
