import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import VRAvatarHub from './VRAvatarHub';

describe('VRAvatarHub', () => {
  it('spawns avatars', () => {
    const { getByLabelText, getAllByRole } = render(<VRAvatarHub />);
    const btn = getByLabelText('spawn-avatar');
    fireEvent.click(btn);
    expect(getAllByRole('listitem').length).toBe(1);
  });
});
