import { render, screen } from '@testing-library/react';
import BoundaryVisualDebugger from './BoundaryVisualDebugger';

describe('BoundaryVisualDebugger', () => {
  it('renders active boundaries and collisions', () => {
    render(<BoundaryVisualDebugger active={['A', 'B']} collisions={['X']} />);
    expect(screen.getByText('Active Boundaries')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('Collisions')).toBeInTheDocument();
    expect(screen.getByText('X')).toBeInTheDocument();
  });
});
