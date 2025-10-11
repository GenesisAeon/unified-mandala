import { render } from '@testing-library/react';
import CREPWaves from './CREPWaves';

describe('CREPWaves', () => {
  it('renders wave svg', () => {
    const { getByLabelText } = render(
      <CREPWaves history={[{ timestamp: new Date(1), C: 1, R: 1, E: 1, P: 1 }]} />,
    );
    const svg = getByLabelText('CREP Waves');
    expect(svg.nodeName.toLowerCase()).toBe('svg');
  });
});
