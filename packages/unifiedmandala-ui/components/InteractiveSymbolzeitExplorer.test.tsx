import { render, fireEvent } from '@testing-library/react';
import { InteractiveSymbolzeitExplorer } from './InteractiveSymbolzeitExplorer';

test('increments symbolzeit', () => {
  const { getByText, getByTestId } = render(<InteractiveSymbolzeitExplorer />);
  fireEvent.click(getByText('next'));
  expect(getByTestId('symbolzeit').textContent).toBe('1');
});
