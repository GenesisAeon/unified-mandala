import { render, fireEvent } from '@testing-library/react';
import AIUI from './components/AIUI';

test('renders and sends message', () => {
  const { getByLabelText, getByText } = render(<AIUI />);
  fireEvent.change(getByLabelText('message'), { target: { value: 'hello' } });
  fireEvent.click(getByText('Send'));
  expect(getByText(/Codex: hello/)).toBeInTheDocument();
});
