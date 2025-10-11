import { render } from '@testing-library/react';
import { CREPInsightDashboard } from './CREPInsightDashboard';

test('renders score, level, and bar width', () => {
  const { getByTestId } = render(<CREPInsightDashboard score={5} />);
  expect(getByTestId('score').textContent).toBe('5');
  expect(getByTestId('level').textContent).toBe('medium');
  expect((getByTestId('bar') as HTMLDivElement).style.width).toBe('50%');
});
