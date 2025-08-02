import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArchiveMap, { ArchiveSite } from './ArchiveMap';

test('renders sites and triggers callback', () => {
  const sites: ArchiveSite[] = [
    { id: '1', name: 'Pumapunku', lat: -16.551, lon: -68.673 },
  ];
  const onSelect = jest.fn();
  render(<ArchiveMap sites={sites} onSelect={onSelect} />);
  const marker = screen.getByRole('button', { name: 'Pumapunku' });
  expect(marker).toBeInTheDocument();
  fireEvent.click(marker);
  expect(onSelect).toHaveBeenCalledWith(sites[0]);
});
