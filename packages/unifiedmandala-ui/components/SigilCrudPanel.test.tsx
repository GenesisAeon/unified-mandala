import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SigilCrudPanel from './SigilCrudPanel';
import { SigilManager } from '../../shared-utils/SigilManager';

test('adds and deletes sigils via manager', () => {
  const mgr = new SigilManager();
  render(<SigilCrudPanel manager={mgr} />);
  fireEvent.change(screen.getByLabelText('Sigil ID'), { target: { value: 'alpha' } });
  fireEvent.change(screen.getByLabelText('Sigil Content'), { target: { value: '{"v":1}' } });
  fireEvent.click(screen.getByText('Add'));
  expect(screen.getByText('alpha')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Delete'));
  expect(screen.queryByText('alpha')).toBeNull();
});
