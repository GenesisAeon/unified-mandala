import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AvatarraumFeatureSet from '../AvatarraumFeatureSet';

describe('AvatarraumFeatureSet', () => {
  it('lists features', () => {
    render(<AvatarraumFeatureSet />);
    const list = screen.getByLabelText('avatarraum-features');
    expect(list.children.length).toBe(5);
  });
});
