import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmergencePanel, { CatalystSpark } from './EmergencePanel';

test('renders catalyst sparks', () => {
  const sparks: CatalystSpark[] = [
    { description: 'spark-one', intensity: 0.7 },
    { description: 'spark-two', intensity: 0.3 },
  ];

  render(<EmergencePanel sparks={sparks} />);
  const panel = screen.getByTestId('emergence-panel');
  expect(panel).toHaveTextContent('spark-one');
  expect(panel).toHaveTextContent('70%');
});
