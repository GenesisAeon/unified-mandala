import { render } from '@testing-library/react';
import CREPVisualizer from './CREPVisualizer';

describe('CREPVisualizer', () => {
  it('renders svg timeline', () => {
    const { getByLabelText } = render(
      <CREPVisualizer history={[{ timestamp: new Date(1), C: 1, R: 1, E: 1, P: 1 }]} />,
    );
    const svg = getByLabelText('CREP Visualizer');
    expect(svg.nodeName.toLowerCase()).toBe('svg');
  });

  it('shows badges for entries with insights', () => {
    const { getAllByTestId } = render(
      <CREPVisualizer
        history={[
          { timestamp: new Date(1), C: 1, R: 1, E: 1, P: 1, insights: 2 },
          { timestamp: new Date(2), C: 2, R: 2, E: 2, P: 2 },
        ]}
      />,
    );
    expect(getAllByTestId('crep-badge')).toHaveLength(1);
  });
});
