import fs from 'fs';
import path from 'path';
import { BackupManager } from './BackupManager';

describe('BackupManager', () => {
  const tmpDir = path.join(__dirname, '__backup_test');
  const source = path.join(tmpDir, 'a.txt');
  const destDir = path.join(tmpDir, 'dest');

  beforeAll(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(source, 'content');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('copies file to destination', () => {
    const manager = new BackupManager(destDir);
    manager.backupFile(source);
    const target = path.join(destDir, 'a.txt');
    expect(fs.existsSync(target)).toBe(true);
  });

  it('throws when copy fails', () => {
    const spy = jest.spyOn(fs, 'copyFileSync').mockImplementation(() => {
      throw new Error('fail');
    });
    const manager = new BackupManager(destDir);
    expect(() => manager.backupFile(source)).toThrow('Failed to backup');
    spy.mockRestore();
  });
});
