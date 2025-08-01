import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeereButton from './LeereButton';

test('toggles label and calls callback', () => {
  const cb = jest.fn();
  render(<LeereButton onToggle={cb} />);
  const btn = screen.getByLabelText('toggle-number-sequence');
  expect(btn).toHaveTextContent('Nummern anzeigen');
  fireEvent.click(btn);
  expect(btn).toHaveTextContent('Nummern ausblenden');
  expect(cb).toHaveBeenCalledWith(true);
  fireEvent.click(btn);
  expect(btn).toHaveTextContent('Nummern anzeigen');
  expect(cb).toHaveBeenCalledWith(false);
});
