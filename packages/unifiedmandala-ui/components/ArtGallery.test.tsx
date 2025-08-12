import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArtGallery from './ArtGallery';

test('renders provided art pieces', () => {
  const pieces = [
    { id: 'one', url: '/img/one.png' },
    { id: 'two', url: '/img/two.png' },
  ];
  render(<ArtGallery pieces={pieces} />);
  const gallery = screen.getByTestId('art-gallery');
  expect(gallery.querySelectorAll('img')).toHaveLength(2);
});
