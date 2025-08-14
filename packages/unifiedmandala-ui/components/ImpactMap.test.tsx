import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImpactMap from './ImpactMap';

test('renders provided impact metrics', () => {
  const metrics = [
    { label: 'health', value: 80 },
    { label: 'education', value: 90 },
  ];
  render(<ImpactMap metrics={metrics} />);
  const list = screen.getByTestId('impact-map');
  expect(list).toHaveTextContent('health: 80');
  expect(list).toHaveTextContent('education: 90');
});
