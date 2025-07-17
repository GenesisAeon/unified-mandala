import { render } from '@testing-library/react';
import PantheonAvatarraum from '../PantheonAvatarraum';
import { describe, it, expect } from 'vitest';

describe('PantheonAvatarraum', () => {
  it('renders text', () => {
    const { container } = render(<PantheonAvatarraum />);
    expect(container.textContent).toContain('Pantheon Avatarraum');
  });
});
