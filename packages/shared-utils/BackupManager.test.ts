import fs from 'fs';
import path from 'path';
import { BackupManager } from './BackupManager';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('BackupManager', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedFs.existsSync.mockReturnValue(true);
  });

  it('copies a file into the configured directory', () => {
    const manager = new BackupManager('dest');
    manager.backupFile('source.txt');
    expect(mockedFs.copyFileSync).toHaveBeenCalledWith(
      'source.txt',
      path.join('dest', 'source.txt')
    );
  });
});
