import { render, fireEvent } from '@testing-library/react';
import UploadYamlForm from './UploadYamlForm';

class MockFileReader {
  result: string | ArrayBuffer | null = null;
  onload: ((e: ProgressEvent<FileReader>) => any) | null = null;
  readAsText(_file: Blob) {
    this.result = 'hello';
    if (this.onload) this.onload({} as ProgressEvent<FileReader>);
  }
}

test('converts uploaded file to yaml', () => {
  (global as any).FileReader = MockFileReader as any;
  const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
  const { getByTestId } = render(<UploadYamlForm />);
  const input = getByTestId('file-input') as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
  const output = getByTestId('yaml-output') as HTMLTextAreaElement;
  expect(output.value).toContain('hello');
});
