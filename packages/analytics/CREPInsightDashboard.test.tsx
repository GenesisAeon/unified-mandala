import { render } from '@testing-library/react';
import { CREPInsightDashboard } from './CREPInsightDashboard';

test('shows score', () => {
  const { getByTestId } = render(<CREPInsightDashboard score={5} />);
  expect(getByTestId('score').textContent).toBe('5');
});
