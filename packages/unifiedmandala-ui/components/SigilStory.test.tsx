// d3 is esm only; mock minimal API
jest.mock('d3', () => ({
  select: () => ({
    selectAll: () => ({ remove: jest.fn() }),
    append: () => ({
      attr: jest.fn().mockReturnThis(),
      selectAll: jest.fn().mockReturnThis(),
      data: jest.fn().mockReturnThis(),
      enter: jest.fn().mockReturnThis(),
      append: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
    }),
  }),
  max: () => 1,
  scaleLinear: () => ({ domain: () => ({ range: () => (x: number) => x }) }),
  arc: () => ({
    innerRadius: () => ({ outerRadius: () => ({}) }),
  }),
}));

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SigilStory from './SigilStory';

const data = [{ name: 'C-Tutor', milestones: [{ sigil: 's1', hint: 'start', time: 1 }] }];

test('renders Sigil Story SVG', () => {
  render(<SigilStory paths={data} />);
  expect(screen.getByLabelText('Sigil Story')).toBeInTheDocument();
});
