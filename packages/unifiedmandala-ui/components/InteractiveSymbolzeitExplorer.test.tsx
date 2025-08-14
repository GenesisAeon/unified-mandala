import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveSymbolzeitExplorer from './InteractiveSymbolzeitExplorer';

test('explores past and future symbolzeit', () => {
  const onChange = jest.fn();
  render(<InteractiveSymbolzeitExplorer initial={0} onChange={onChange} />);
  expect(screen.getByText('Symbolzeit: 0')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Future'));
  expect(screen.getByText('Symbolzeit: 1')).toBeInTheDocument();
  expect(onChange).toHaveBeenCalledWith(1);
  fireEvent.click(screen.getByText('Past'));
  expect(screen.getByText('Symbolzeit: 0')).toBeInTheDocument();
});
