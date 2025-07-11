import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumericDashboard from './NumericDashboard';

test('renders table and histogram', () => {
  const data = [{ label: 'C', value: 2 }];
  const { getByLabelText } = render(<NumericDashboard data={data} />);
  expect(getByLabelText('Numeric Table')).toBeInTheDocument();
  const svg = getByLabelText('Numeric Histogram');
  expect(svg.nodeName.toLowerCase()).toBe('svg');
});

