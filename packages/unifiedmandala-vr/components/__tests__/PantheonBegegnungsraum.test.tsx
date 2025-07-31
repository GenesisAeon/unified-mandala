import { render } from '@testing-library/react';
import PantheonBegegnungsraum from '../PantheonBegegnungsraum';
import { describe, it, expect } from 'vitest';

describe('PantheonBegegnungsraum', () => {
  it('renders VR scene', () => {
    const { getByLabelText } = render(<PantheonBegegnungsraum />);
    expect(getByLabelText('pantheon-begegnungsraum')).toBeInTheDocument();
  });
});
