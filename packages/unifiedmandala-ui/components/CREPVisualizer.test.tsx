import { render } from '@testing-library/react';
import CREPVisualizer from './CREPVisualizer';

describe('CREPVisualizer', () => {
  it('renders svg timeline', () => {
    const { getByLabelText } = render(
      <CREPVisualizer history={[{ timestamp: new Date(1), C: 1, R: 1, E: 1, P: 1 }]} />
    );
    const svg = getByLabelText('CREP Visualizer');
    expect(svg.nodeName.toLowerCase()).toBe('svg');
  });
});
