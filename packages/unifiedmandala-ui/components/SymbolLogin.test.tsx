import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SymbolLogin from './SymbolLogin';

test('submits entered symbol', () => {
  const submit = jest.fn();
  render(<SymbolLogin onSubmit={submit} />);
  fireEvent.change(screen.getByLabelText('Symbol-Login'), { target: { value: '🜂' } });
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  expect(submit).toHaveBeenCalledWith('🜂');
});
