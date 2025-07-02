import { render } from '@testing-library/react';
import { EventVisualizationDashboard } from './EventVisualizationDashboard';

test('renders events', () => {
  const { getByTestId } = render(<EventVisualizationDashboard events={[{a:1}]} />);
  expect(getByTestId('events').textContent).toContain('a');
});
