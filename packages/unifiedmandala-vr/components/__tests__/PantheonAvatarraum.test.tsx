import { render } from '@testing-library/react';
import PantheonAvatarraum from '../PantheonAvatarraum';
import { describe, it, expect } from 'vitest';

describe('PantheonAvatarraum', () => {
  it('renders 3d scene', () => {
    const { getByLabelText } = render(<PantheonAvatarraum />);
    expect(getByLabelText('pantheon-avatarraum')).toBeInTheDocument();
  });
});
