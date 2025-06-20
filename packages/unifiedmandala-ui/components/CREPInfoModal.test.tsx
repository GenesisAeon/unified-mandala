import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CREPInfoModal from './CREPInfoModal';

test('renders modal content and closes', () => {
  const onClose = jest.fn();
  render(<CREPInfoModal open={true} onClose={onClose} />);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Schließen'));
  expect(onClose).toHaveBeenCalled();
});
