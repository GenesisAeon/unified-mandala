import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SigillinLoader from './SigillinLoader';

const yamlData = `- name: test\n  value: 1`;

function createFile(contents: string, name: string) {
  return new File([contents], name, { type: 'text/plain' });
}

test('loads yaml file and shows count', async () => {
  render(<SigillinLoader />);
  const input = screen.getByLabelText('Sigillin laden') as HTMLInputElement;
  const file = createFile(yamlData, 'example.yaml');
  await waitFor(() => fireEvent.change(input, { target: { files: [file] } }));
  await screen.findByText('1 Einträge geladen');
});
