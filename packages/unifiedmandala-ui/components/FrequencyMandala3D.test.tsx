import { render } from '@testing-library/react';
import FrequencyMandala3D from './FrequencyMandala3D';
import { describe, it, expect } from 'vitest';

describe('FrequencyMandala3D', () => {
  it('renders canvas', () => {
    const { container } = render(<FrequencyMandala3D />);
    expect(container.querySelector('canvas')).toBeTruthy();
  });
});
