import { archiveSigil } from './index';
import fs from 'fs';
describe('archiveSigil', () => {
  it('writes file to disk', async () => {
    const write = jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined as any);
    jest.spyOn(fs.promises, 'mkdir').mockResolvedValue(undefined as any);
    const path = await archiveSigil('test', 'data', 'tmp');
    expect(write).toHaveBeenCalled();
    expect(path).toContain('test.yaml');
  });
});
