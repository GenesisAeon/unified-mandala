import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CREPTooltip from './CREPTooltip';

test('shows tooltip with provided value', () => {
  render(<CREPTooltip value={4} />);
  const tooltip = screen.getByTestId('crep-tooltip');
  expect(tooltip).toHaveAttribute('title', 'CREP value: 4');
});

test('renders custom children', () => {
  render(<CREPTooltip value={1}>?</CREPTooltip>);
  expect(screen.getByText('?')).toBeInTheDocument();
});
